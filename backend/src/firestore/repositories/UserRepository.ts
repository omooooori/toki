import { getFirestoreInstance } from '../index';
import { User, UserModel } from '../../models/User';

export class UserRepository {
  private db = getFirestoreInstance();
  private collection = 'users';

  async findById(id: string): Promise<User | null> {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return UserModel.fromFirestore(doc.id, doc.data());
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const userModel = new UserModel({ ...user, id: '' });
      const docRef = await this.db.collection(this.collection).add(userModel.toFirestore());
      return { ...user, id: docRef.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createWithId(id: string, user: Omit<User, 'id'>): Promise<User> {
    try {
      const userModel = new UserModel({ ...user, id });
      await this.db.collection(this.collection).doc(id).set(userModel.toFirestore());
      return { ...user, id };
    } catch (error) {
      console.error('Error creating user with ID:', error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const docRef = this.db.collection(this.collection).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return UserModel.fromFirestore(updatedDoc.id, updatedDoc.data());
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
} 