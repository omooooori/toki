import { UserRepository } from '../firestore/repositories/UserRepository';
import { AuthenticatedRequest } from '../auth/middleware';

const userRepository = new UserRepository();

export const userResolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        // 認証されたユーザーのみ自分の情報を取得可能
        if (req.user?.uid !== id) {
          throw new Error('Unauthorized access to user data');
        }
        
        return await userRepository.findById(id);
      } catch (error) {
        console.error('Error in getUser resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    createUser: async (_: any, { name }: { name: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        // Firebase UIDをFirestoreドキュメントIDとして使用
        const user = await userRepository.createWithId(req.user.uid, {
          name,
          createdAt: new Date(),
        });
        
        return user;
      } catch (error) {
        console.error('Error in createUser resolver:', error);
        throw error;
      }
    },
    
    updateUser: async (_: any, { id, name }: { id: string; name?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        // 認証されたユーザーのみ自分の情報を更新可能
        if (req.user?.uid !== id) {
          throw new Error('Unauthorized access to user data');
        }
        
        return await userRepository.update(id, { name });
      } catch (error) {
        console.error('Error in updateUser resolver:', error);
        throw error;
      }
    },
  },
}; 