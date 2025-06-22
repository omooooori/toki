import { CalendarEventRepository } from '../firestore/repositories/CalendarEventRepository';
import { AuthenticatedRequest } from '../auth/middleware';

const calendarEventRepository = new CalendarEventRepository();

export const calendarEventResolvers = {
  Query: {
    getCalendarEvents: async (_: any, { userId, startDate, endDate }: { userId: string; startDate?: Date; endDate?: Date }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to calendar event data');
        }
        
        return await calendarEventRepository.findByUserId(userId, startDate, endDate);
      } catch (error) {
        console.error('Error in getCalendarEvents resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    createCalendarEvent: async (_: any, { userId, title, startTime, endTime, location }: { userId: string; title: string; startTime: Date; endTime: Date; location?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid || req.user.uid !== userId) {
          throw new Error('Unauthorized access to create calendar event');
        }
        
        return await calendarEventRepository.create({
          userId,
          title,
          startTime,
          endTime,
          location,
        });
      } catch (error) {
        console.error('Error in createCalendarEvent resolver:', error);
        throw error;
      }
    },
    
    updateCalendarEvent: async (_: any, { id, title, startTime, endTime, location }: { id: string; title?: string; startTime?: Date; endTime?: Date; location?: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const event = await calendarEventRepository.findById(id);
        if (!event || event.userId !== req.user.uid) {
          throw new Error('Unauthorized access to update calendar event');
        }
        
        return await calendarEventRepository.update(id, { title, startTime, endTime, location });
      } catch (error) {
        console.error('Error in updateCalendarEvent resolver:', error);
        throw error;
      }
    },
    
    deleteCalendarEvent: async (_: any, { id }: { id: string }, { req }: { req: AuthenticatedRequest }) => {
      try {
        if (!req.user?.uid) {
          throw new Error('User not authenticated');
        }
        
        const event = await calendarEventRepository.findById(id);
        if (!event || event.userId !== req.user.uid) {
          throw new Error('Unauthorized access to delete calendar event');
        }
        
        return await calendarEventRepository.delete(id);
      } catch (error) {
        console.error('Error in deleteCalendarEvent resolver:', error);
        throw error;
      }
    },
  },
}; 