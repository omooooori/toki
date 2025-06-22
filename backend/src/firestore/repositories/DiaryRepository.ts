import { getFirestoreInstance } from '../index';
import { Diary, DiaryModel } from '../../models/Diary';

export class DiaryRepository {
  private db = getFirestoreInstance();
  private collection = 'diaries';

  async findById(id: string): Promise<Diary | null> {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return DiaryModel.fromFirestore(doc.id, doc.data());
    } catch (error) {
      console.error('Error finding diary by ID:', error);
      throw error;
    }
  }

  async findByDate(date: string): Promise<Diary | null> {
    try {
      const query = await this.db.collection(this.collection)
        .where('date', '==', date)
        .limit(1)
        .get();
      
      if (query.empty) {
        return null;
      }
      
      const doc = query.docs[0];
      return DiaryModel.fromFirestore(doc.id, doc.data());
    } catch (error) {
      console.error('Error finding diary by date:', error);
      throw error;
    }
  }

  async findByUserId(userId: string, startDate?: string, endDate?: string): Promise<Diary[]> {
    try {
      let query = this.db.collection(this.collection).where('userId', '==', userId);
      
      if (startDate) {
        query = query.where('date', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('date', '<=', endDate);
      }
      
      const snapshot = await query.orderBy('date', 'desc').get();
      
      return snapshot.docs.map(doc => DiaryModel.fromFirestore(doc.id, doc.data()));
    } catch (error) {
      console.error('Error finding diaries by user ID:', error);
      throw error;
    }
  }

  async create(diary: Omit<Diary, 'id' | 'photos'>): Promise<Diary> {
    try {
      const diaryModel = new DiaryModel({ ...diary, id: '', photos: [] });
      const docRef = await this.db.collection(this.collection).add(diaryModel.toFirestore());
      return { ...diary, id: docRef.id, photos: [] };
    } catch (error) {
      console.error('Error creating diary:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Diary>): Promise<Diary | null> {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const updateData: any = {};
      if (updates.generatedText !== undefined) updateData.generatedText = updates.generatedText;
      if (updates.editedText !== undefined) updateData.editedText = updates.editedText;

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return DiaryModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    } catch (error) {
      console.error('Error updating diary:', error);
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
      console.error('Error deleting diary:', error);
      throw error;
    }
  }
} 