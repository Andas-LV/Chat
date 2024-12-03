export type SendMessage = {
    content: string,
    conversationId: number
}

export interface User {
    id: number;
    username: string;
    avatarUrl: string;
}

export interface Message {
    id: number
    conversationId: number

    sender: User
    senderId: number

    content: string
    timestamp: string
}

export interface Room {
    id: number;
    initiator: User
    receiver: User
    message_set: Message[];
}

export interface Rooms {
    id: number;
    initiator: User
    receiver: User
    last_message: Message;
    unReaded: number;
}