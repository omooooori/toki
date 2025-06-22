import { getFirestoreInstance } from '../index';
import { LocationVisit, LocationVisitModel } from '../../models/LocationVisit';

export class LocationVisitRepository {
  private db = getFirestoreInstance();
  private collection = 'locationVisits';

  async findById(id: string): Promise<LocationVisit | null> {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return LocationVisitModel.fromFirestore(doc.id, doc.data());
    } catch (error) {
      console.error('Error finding location visit by ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<LocationVisit[]> {
    try {
      let query = this.db.collection(this.collection).where('userId', '==', userId);
      
      if (startDate) {
        query = query.where('visitedAt', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('visitedAt', '<=', endDate);
      }
      
      const snapshot = await query.orderBy('visitedAt', 'desc').get();
      
      return snapshot.docs.map(doc => LocationVisitModel.fromFirestore(doc.id, doc.data()));
    } catch (error) {
      console.error('Error finding location visits by user ID:', error);
      throw error;
    }
  }

  async create(locationVisit: Omit<LocationVisit, 'id'>): Promise<LocationVisit> {
    try {
      const locationVisitModel = new LocationVisitModel({ ...locationVisit, id: '' });
      const docRef = await this.db.collection(this.collection).add(locationVisitModel.toFirestore());
      return { ...locationVisit, id: docRef.id };
    } catch (error) {
      console.error('Error creating location visit:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<LocationVisit>): Promise<LocationVisit | null> {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const updateData: any = {};
      if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
      if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
      if (updates.placeName !== undefined) updateData.placeName = updates.placeName;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.visitedAt !== undefined) updateData.visitedAt = updates.visitedAt;
      if (updates.durationMinutes !== undefined) updateData.durationMinutes = updates.durationMinutes;

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return LocationVisitModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    } catch (error) {
      console.error('Error updating location visit:', error);
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
      console.error('Error deleting location visit:', error);
      throw error;
    }
  }
} 