import { DatabaseConfig, User } from '../types/database.types';
export declare class UserRepository {
    private firebaseService?;
    private prismaService?;
    private databaseType;
    constructor(config: DatabaseConfig);
    createUser(email: string, name?: string): Promise<User>;
    getUser(userId: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    verifyToken(token: string): Promise<string>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map