import { LocationVisitRepository } from '../firestore/repositories/LocationVisitRepository';
import { AuthenticatedRequest } from '../auth/middleware';

const locationVisitRepository = new LocationVisitRepository();

export const locationVisitResolvers = {
  Query: {
    getLocationVisits: async (_: any, { userId, startDate, endDate }: { userId: string; startDate?: Date; endDate?: Date }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to location visit data');
        }
        
        return await locationVisitRepository.findByUserId(userId, startDate, endDate);
      } catch (error) {
        console.error('Error in getLocationVisits resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    createLocationVisit: async (_: any, { userId, latitude, longitude, placeName, address, visitedAt, durationMinutes }: { userId: string; latitude: number; longitude: number; placeName?: string; address?: string; visitedAt: Date; durationMinutes?: number }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to create location visit');
        }
        
        return await locationVisitRepository.create({
          userId,
          latitude,
          longitude,
          placeName,
          address,
          visitedAt,
          durationMinutes,
        });
      } catch (error) {
        console.error('Error in createLocationVisit resolver:', error);
        throw error;
      }
    },
    
    updateLocationVisit: async (_: any, { id, latitude, longitude, placeName, address, visitedAt, durationMinutes }: { id: string; latitude?: number; longitude?: number; placeName?: string; address?: string; visitedAt?: Date; durationMinutes?: number }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const locationVisit = await locationVisitRepository.findById(id);
        if (!locationVisit || locationVisit.userId !== req.user.uid) {
          throw new Error('Unauthorized access to update location visit');
        }
        
        return await locationVisitRepository.update(id, { latitude, longitude, placeName, address, visitedAt, durationMinutes });
      } catch (error) {
        console.error('Error in updateLocationVisit resolver:', error);
        throw error;
      }
    },
    
    deleteLocationVisit: async (_: any, { id }: { id: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const locationVisit = await locationVisitRepository.findById(id);
        if (!locationVisit || locationVisit.userId !== req.user.uid) {
          throw new Error('Unauthorized access to delete location visit');
        }
        
        return await locationVisitRepository.delete(id);
      } catch (error) {
        console.error('Error in deleteLocationVisit resolver:', error);
        throw error;
      }
    },
  },
}; 