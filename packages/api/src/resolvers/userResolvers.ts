import { UserRepository } from '@toki/db';
import { DatabaseConfig } from '@toki/db';

export class UserResolvers {
  private userRepository: UserRepository;

  constructor(dbConfig: DatabaseConfig) {
    this.userRepository = new UserRepository(dbConfig);
  }

  // Query resolvers
  async me(parent: any, args: any, context: any) {
    try {
      const userId = context.userId;
      if (!userId) {
        throw new Error('認証が必要です');
      }

      const user = await this.userRepository.getUser(userId);
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }

      return user;
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      throw new Error('ユーザー情報の取得に失敗しました');
    }
  }

  async getUser(parent: any, { id }: { id: string }, context: any) {
    try {
      const user = await this.userRepository.getUser(id);
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }

      return user;
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      throw new Error('ユーザーの取得に失敗しました');
    }
  }

  // Field resolvers
  async diaries(parent: any, args: any, context: any) {
    // この実装はDiaryResolversで行うため、ここでは空の配列を返す
    return [];
  }
} 