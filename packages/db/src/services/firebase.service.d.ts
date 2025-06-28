import { DatabaseConfig, User, Diary, CreateDiaryInput, UpdateDiaryInput, DiaryQueryOptions } from '../types/database.types';
export declare class FirebaseService {
    private app;
    private firestore;
    private auth;
    constructor(config: DatabaseConfig);
    createUser(email: string, name?: string): Promise<User>;
    getUser(userId: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    createDiary(input: CreateDiaryInput): Promise<Diary>;
    getDiary(diaryId: string): Promise<Diary | null>;
    getDiaries(options: DiaryQueryOptions): Promise<Diary[]>;
    updateDiary(diaryId: string, input: UpdateDiaryInput): Promise<Diary>;
    deleteDiary(diaryId: string): Promise<boolean>;
    verifyToken(token: string): Promise<string>;
}
//# sourceMappingURL=firebase.service.d.ts.map