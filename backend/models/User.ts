export class User {
    userId: string
    username: string
    passwordHash: string

    constructor(userId: string, username: string, passwordHash: string) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
    }
}
