export type User = {
    id: number,
    username: string,
    email: string,
    avatarUrl: string
}

export type Register = {
    email: string,
    username: string,
    password: string,
}

export type Login = {
    username: string,
    password: string,
}
