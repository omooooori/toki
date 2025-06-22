import { DiaryRepository } from '../firestore/repositories/DiaryRepository';
import { PhotoRepository } from '../firestore/repositories/PhotoRepository';
import { AuthenticatedRequest } from '../auth/middleware';

const diaryRepository = new DiaryRepository();
const photoRepository = new PhotoRepository();

export const diaryResolvers = {
  Query: {
    getDiary: async (_: any, { date }: { date: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const diary = await diaryRepository.findByDate(date);
        if (!diary || diary.userId !== req.user.uid) {
          return null;
        }
        
        return diary;
      } catch (error) {
        console.error('Error in getDiary resolver:', error);
        throw error;
      }
    },
    
    getDiaries: async (_: any, { userId, startDate, endDate }: { userId: string; startDate?: string; endDate?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to diary data');
        }
        
        return await diaryRepository.findByUserId(userId, startDate, endDate);
      } catch (error) {
        console.error('Error in getDiaries resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    createDiary: async (_: any, { userId, date, generatedText, editedText }: { userId: string; date: string; generatedText: string; editedText?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to create diary');
        }
        
        return await diaryRepository.create({
          userId,
          date,
          generatedText,
          editedText,
        });
      } catch (error) {
        console.error('Error in createDiary resolver:', error);
        throw error;
      }
    },
    
    updateDiary: async (_: any, { id, generatedText, editedText }: { id: string; generatedText?: string; editedText?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const diary = await diaryRepository.findById(id);
        if (!diary || diary.userId !== req.user.uid) {
          throw new Error('Unauthorized access to update diary');
        }
        
        return await diaryRepository.update(id, { generatedText, editedText });
      } catch (error) {
        console.error('Error in updateDiary resolver:', error);
        throw error;
      }
    },
    
    deleteDiary: async (_: any, { id }: { id: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const diary = await diaryRepository.findById(id);
        if (!diary || diary.userId !== req.user.uid) {
          throw new Error('Unauthorized access to delete diary');
        }
        
        return await diaryRepository.delete(id);
      } catch (error) {
        console.error('Error in deleteDiary resolver:', error);
        throw error;
      }
    },
  },
  
  Diary: {
    photos: async (parent: any, _: any, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || parent.userId !== req.user.uid) {
          return [];
        }
        
        // 日記の日付に基づいて写真を取得
        const date = new Date(parent.date);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        return await photoRepository.findByUserId(parent.userId, startOfDay, endOfDay);
      } catch (error) {
        console.error('Error in Diary.photos resolver:', error);
        return [];
      }
    },
  },
}; 