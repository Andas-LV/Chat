import { PrismaClient } from '@prisma/client';
import {deleteFileFromS3, generateUniqueFileName} from "../utils/uploadAvatar.js";
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '../config/aws.js'

const prisma = new PrismaClient();

export async function getAllUsersExceptMe(req, res) {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: req.user.id, // Исключаем текущего пользователя
                },
            },
            select: {
                id: true,
                email: true,
                username: true,
                avatarUrl: true,
                updatedAt: true,
            },
        });

        res.json(users);
    } catch (error) {
        console.error('Error in /users endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export async function getUserMe (req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                username: true,
                avatarUrl: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in /me endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateUserMe (req, res) {
    try {
        const { username, email } = req.body;

        // Check if email or username already exists
        if (email || username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        email ? { email: email } : {},
                        username ? { username: username } : {}
                    ],
                    NOT: {
                        id: req.user.id
                    }
                }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email or username already taken' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(username && { username }),
                ...(email && { email })
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function uploadAvatar(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarUrl: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const fileName = generateUniqueFileName(req.file.originalname);

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read',
        }));

        const newAvatarUrl = `https://${process.env.AWS_STORAGE_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION_NAME}.amazonaws.com/${fileName}`;

        await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: newAvatarUrl }
        });

        if (user.avatarUrl) {
            await deleteFileFromS3(user.avatarUrl);
        }

        res.json({
            message: 'Avatar updated successfully',
            avatarUrl: newAvatarUrl
        });

    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
}