import { PhotoRepository } from '../firestore/repositories/PhotoRepository';
import { AuthenticatedRequest } from '../auth/middleware';

const photoRepository = new PhotoRepository();

export const photoResolvers = {
  Query: {
    getPhotos: async (_: any, { userId, startDate, endDate }: { userId: string; startDate?: Date; endDate?: Date }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to photo data');
        }
        
        return await photoRepository.findByUserId(userId, startDate, endDate);
      } catch (error) {
        console.error('Error in getPhotos resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    createPhoto: async (_: any, { userId, imageUrl, takenAt, relatedLocationId }: { userId: string; imageUrl: string; takenAt: Date; relatedLocationId?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to create photo');
        }
        
        return await photoRepository.create({
          userId,
          imageUrl,
          takenAt,
          relatedLocationId,
        });
      } catch (error) {
        console.error('Error in createPhoto resolver:', error);
        throw error;
      }
    },
    
    updatePhoto: async (_: any, { id, imageUrl, takenAt, relatedLocationId }: { id: string; imageUrl?: string; takenAt?: Date; relatedLocationId?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const photo = await photoRepository.findById(id);
        if (!photo || photo.userId !== req.user.uid) {
          throw new Error('Unauthorized access to update photo');
        }
        
        return await photoRepository.update(id, { imageUrl, takenAt, relatedLocationId });
      } catch (error) {
        console.error('Error in updatePhoto resolver:', error);
        throw error;
      }
    },
    
    deletePhoto: async (_: any, { id }: { id: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const photo = await photoRepository.findById(id);
        if (!photo || photo.userId !== req.user.uid) {
          throw new Error('Unauthorized access to delete photo');
        }
        
        return await photoRepository.delete(id);
      } catch (error) {
        console.error('Error in deletePhoto resolver:', error);
        throw error;
      }
    },
  },
}; 