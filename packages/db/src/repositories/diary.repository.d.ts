import { DatabaseConfig, Diary, CreateDiaryInput, UpdateDiaryInput, DiaryQueryOptions } from '../types/database.types';
export declare class DiaryRepository {
    private firebaseService?;
    private prismaService?;
    private databaseType;
    constructor(config: DatabaseConfig);
    createDiary(input: CreateDiaryInput): Promise<Diary>;
    getDiary(diaryId: string): Promise<Diary | null>;
    getDiaries(options: DiaryQueryOptions): Promise<Diary[]>;
    updateDiary(diaryId: string, input: UpdateDiaryInput): Promise<Diary>;
    deleteDiary(diaryId: string): Promise<boolean>;
    getDiariesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Diary[]>;
    getRecentDiaries(userId: string, limit?: number): Promise<Diary[]>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=diary.repository.d.ts.map