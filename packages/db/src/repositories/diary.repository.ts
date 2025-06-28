import { FirebaseService } from '../services/firebase.service';
import { DatabaseConfig, Diary, CreateDiaryInput, UpdateDiaryInput, DiaryQueryOptions } from '../types/database.types';

export class DiaryRepository {
  private firebaseService: FirebaseService;

  constructor(config: DatabaseConfig) {
    this.firebaseService = new FirebaseService(config);
  }

  async createDiary(input: CreateDiaryInput): Promise<Diary> {
    return await this.firebaseService.createDiary(input);
  }

  async getDiary(diaryId: string): Promise<Diary | null> {
    return await this.firebaseService.getDiary(diaryId);
  }

  async getDiaries(options: DiaryQueryOptions): Promise<Diary[]> {
    return await this.firebaseService.getDiaries(options);
  }

  async updateDiary(diaryId: string, input: UpdateDiaryInput): Promise<Diary> {
    return await this.firebaseService.updateDiary(diaryId, input);
  }

  async deleteDiary(diaryId: string): Promise<boolean> {
    return await this.firebaseService.deleteDiary(diaryId);
  }

  async getDiariesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Diary[]> {
    return await this.getDiaries({
      userId,
      startDate,
      endDate,
    });
  }

  async getRecentDiaries(userId: string, limit: number = 10): Promise<Diary[]> {
    return await this.getDiaries({
      userId,
      limit,
    });
  }
} 