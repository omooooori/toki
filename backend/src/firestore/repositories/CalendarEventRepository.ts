import { getFirestoreInstance } from '../index';
import { CalendarEvent, CalendarEventModel } from '../../models/CalendarEvent';

export class CalendarEventRepository {
  private db = getFirestoreInstance();
  private collection = 'calendarEvents';

  async findById(id: string): Promise<CalendarEvent | null> {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return CalendarEventModel.fromFirestore(doc.id, doc.data());
    } catch (error) {
      console.error('Error finding calendar event by ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    try {
      let query = this.db.collection(this.collection).where('userId', '==', userId);
      
      if (startDate) {
        query = query.where('startTime', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('endTime', '<=', endDate);
      }
      
      const snapshot = await query.orderBy('startTime', 'asc').get();
      
      return snapshot.docs.map(doc => CalendarEventModel.fromFirestore(doc.id, doc.data()));
    } catch (error) {
      console.error('Error finding calendar events by user ID:', error);
      throw error;
    }
  }

  async create(calendarEvent: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    try {
      const calendarEventModel = new CalendarEventModel({ ...calendarEvent, id: '' });
      const docRef = await this.db.collection(this.collection).add(calendarEventModel.toFirestore());
      return { ...calendarEvent, id: docRef.id };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.startTime !== undefined) updateData.startTime = updates.startTime;
      if (updates.endTime !== undefined) updateData.endTime = updates.endTime;
      if (updates.location !== undefined) updateData.location = updates.location;

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return CalendarEventModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
} 