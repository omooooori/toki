import { DiaryRepository } from '@toki/db';
import { DiaryGeneratorService } from '@toki/ai';
import { DatabaseConfig, CreateDiaryInput, UpdateDiaryInput } from '@toki/db';
import { DiaryGenerationInput } from '@toki/ai';

export class DiaryResolvers {
  private diaryRepository: DiaryRepository;
  private diaryGenerator: DiaryGeneratorService;

  constructor(dbConfig: DatabaseConfig, aiConfig: any) {
    this.diaryRepository = new DiaryRepository(dbConfig);
    this.diaryGenerator = new DiaryGeneratorService();
    
    // AI設定を適用
    if (aiConfig.openai) {
      this.diaryGenerator.setOpenAIConfig(aiConfig.openai);
    }
  }

  // Query resolvers
  async getDiary(parent: any, { id }: { id: string }, context: any) {
    try {
      const diary = await this.diaryRepository.getDiary(id);
      if (!diary) {
        throw new Error('日記が見つかりません');
      }
      return diary;
    } catch (error) {
      console.error('日記取得エラー:', error);
      throw new Error('日記の取得に失敗しました');
    }
  }

  async getDiaries(parent: any, { userId, limit, offset }: { userId: string; limit?: number; offset?: number }, context: any) {
    try {
      return await this.diaryRepository.getDiaries({
        userId,
        limit: limit || 20,
        offset: offset || 0,
      });
    } catch (error) {
      console.error('日記一覧取得エラー:', error);
      throw new Error('日記一覧の取得に失敗しました');
    }
  }

  // Mutation resolvers
  async createDiary(parent: any, { input }: { input: CreateDiaryInput }, context: any) {
    try {
      // ユーザーIDをコンテキストから取得
      const userId = context.userId;
      if (!userId) {
        throw new Error('認証が必要です');
      }

      const diary = await this.diaryRepository.createDiary({
        ...input,
        userId,
      });

      return diary;
    } catch (error) {
      console.error('日記作成エラー:', error);
      throw new Error('日記の作成に失敗しました');
    }
  }

  async updateDiary(parent: any, { id, input }: { id: string; input: UpdateDiaryInput }, context: any) {
    try {
      const userId = context.userId;
      if (!userId) {
        throw new Error('認証が必要です');
      }

      // 日記の所有者を確認
      const existingDiary = await this.diaryRepository.getDiary(id);
      if (!existingDiary || existingDiary.userId !== userId) {
        throw new Error('日記が見つからないか、編集権限がありません');
      }

      const diary = await this.diaryRepository.updateDiary(id, input);
      return diary;
    } catch (error) {
      console.error('日記更新エラー:', error);
      throw new Error('日記の更新に失敗しました');
    }
  }

  async deleteDiary(parent: any, { id }: { id: string }, context: any) {
    try {
      const userId = context.userId;
      if (!userId) {
        throw new Error('認証が必要です');
      }

      // 日記の所有者を確認
      const existingDiary = await this.diaryRepository.getDiary(id);
      if (!existingDiary || existingDiary.userId !== userId) {
        throw new Error('日記が見つからないか、削除権限がありません');
      }

      const success = await this.diaryRepository.deleteDiary(id);
      return success;
    } catch (error) {
      console.error('日記削除エラー:', error);
      throw new Error('日記の削除に失敗しました');
    }
  }

  async analyzeDiary(parent: any, { id }: { id: string }, context: any) {
    try {
      const userId = context.userId;
      if (!userId) {
        throw new Error('認証が必要です');
      }

      // 日記を取得
      const diary = await this.diaryRepository.getDiary(id);
      if (!diary || diary.userId !== userId) {
        throw new Error('日記が見つからないか、アクセス権限がありません');
      }

      // AI分析を実行
      const analysis = await this.diaryGenerator.analyzeDiary(diary.content);

      // 分析結果を日記に保存
      const updatedDiary = await this.diaryRepository.updateDiary(id, {
        aiAnalysis: {
          sentiment: analysis.sentiment,
          topics: analysis.topics,
          summary: analysis.summary,
          suggestions: analysis.suggestions,
        },
      });

      return updatedDiary.aiAnalysis;
    } catch (error) {
      console.error('日記分析エラー:', error);
      throw new Error('日記の分析に失敗しました');
    }
  }

  async generateDiary(parent: any, { input }: { input: DiaryGenerationInput }, context: any) {
    try {
      const userId = context.userId;
      if (!userId) {
        throw new Error('認証が必要です');
      }

      // AIで日記を生成
      const result = await this.diaryGenerator.generateDiary(input);

      // 生成された日記を保存
      const diary = await this.diaryRepository.createDiary({
        userId,
        content: result.content,
        location: input.location ? {
          latitude: input.location.latitude,
          longitude: input.location.longitude,
          address: input.location.address,
          placeName: input.location.placeName,
        } : undefined,
        photoUrls: input.photos?.map(photo => photo.url) || [],
      });

      // AI分析結果も保存
      const updatedDiary = await this.diaryRepository.updateDiary(diary.id, {
        aiAnalysis: {
          sentiment: result.sentiment,
          topics: result.topics,
          summary: result.summary,
          suggestions: result.suggestions,
        },
      });

      return updatedDiary;
    } catch (error) {
      console.error('日記生成エラー:', error);
      throw new Error('日記の生成に失敗しました');
    }
  }
} 