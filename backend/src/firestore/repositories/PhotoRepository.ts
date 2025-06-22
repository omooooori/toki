import { getFirestoreInstance } from '../index';
import { Photo, PhotoModel } from '../../models/Photo';

export class PhotoRepository {
  private db = getFirestoreInstance();
  private collection = 'photos';

  async findById(id: string): Promise<Photo | null> {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return PhotoModel.fromFirestore(doc.id, doc.data());
    } catch (error) {
      console.error('Error finding photo by ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, startDate?: Date, endDate?: Date): Promise<Photo[]> {
    try {
      let query = this.db.collection(this.collection).where('userId', '==', userId);
      
      if (startDate) {
        query = query.where('takenAt', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('takenAt', '<=', endDate);
      }
      
      const snapshot = await query.orderBy('takenAt', 'desc').get();
      
      return snapshot.docs.map(doc => PhotoModel.fromFirestore(doc.id, doc.data()));
    } catch (error) {
      console.error('Error finding photos by user ID:', error);
      throw error;
    }
  }

  async create(photo: Omit<Photo, 'id'>): Promise<Photo> {
    try {
      const photoModel = new PhotoModel({ ...photo, id: '' });
      const docRef = await this.db.collection(this.collection).add(photoModel.toFirestore());
      return { ...photo, id: docRef.id };
    } catch (error) {
      console.error('Error creating photo:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Photo>): Promise<Photo | null> {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const updateData: any = {};
      if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
      if (updates.takenAt !== undefined) updateData.takenAt = updates.takenAt;
      if (updates.relatedLocationId !== undefined) updateData.relatedLocationId = updates.relatedLocationId;

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return PhotoModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    } catch (error) {
      console.error('Error updating photo:', error);
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
      console.error('Error deleting photo:', error);
      throw error;
    }
  }
} 