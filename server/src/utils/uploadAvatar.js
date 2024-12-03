import multer from 'multer'
import path from 'path'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
        cb(null, true);
    }
});

export const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    return `avatars/${timestamp}-${Math.random().toString(36).substring(2, 15)}${extension}`;
};

export const deleteFileFromS3 = async (fileUrl) => {
    if (!fileUrl) return;

    try {
        const key = fileUrl.split('.com/')[1];
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }));
    } catch (error) {
        console.error('Error deleting file from S3:', error);
    }
};
