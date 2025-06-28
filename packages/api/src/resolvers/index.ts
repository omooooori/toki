import { DiaryResolvers } from './diaryResolvers';
import { UserResolvers } from './userResolvers';
import { DatabaseConfig } from '@toki/db';

export interface Resolvers {
  Query: any;
  Mutation: any;
  User: any;
  Diary: any;
}

export function createResolvers(dbConfig: DatabaseConfig, aiConfig: any): Resolvers {
  const diaryResolvers = new DiaryResolvers(dbConfig, aiConfig);
  const userResolvers = new UserResolvers(dbConfig);

  return {
    Query: {
      me: userResolvers.me.bind(userResolvers),
      user: userResolvers.getUser.bind(userResolvers),
      diary: diaryResolvers.getDiary.bind(diaryResolvers),
      diaries: diaryResolvers.getDiaries.bind(diaryResolvers),
    },
    Mutation: {
      createDiary: diaryResolvers.createDiary.bind(diaryResolvers),
      updateDiary: diaryResolvers.updateDiary.bind(diaryResolvers),
      deleteDiary: diaryResolvers.deleteDiary.bind(diaryResolvers),
      analyzeDiary: diaryResolvers.analyzeDiary.bind(diaryResolvers),
      generateDiary: diaryResolvers.generateDiary.bind(diaryResolvers),
    },
    User: {
      diaries: userResolvers.diaries.bind(userResolvers),
    },
    Diary: {
      // Field resolvers for Diary type
      user: async (parent: any, args: any, context: any) => {
        return await userResolvers.getUser(parent, { id: parent.userId }, context);
      },
    },
  };
} 