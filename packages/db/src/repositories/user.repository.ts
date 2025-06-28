import { FirebaseService } from '../services/firebase.service';
import { DatabaseConfig, User } from '../types/database.types';

export class UserRepository {
  private firebaseService: FirebaseService;

  constructor(config: DatabaseConfig) {
    this.firebaseService = new FirebaseService(config);
  }

  async createUser(email: string, name: string): Promise<User> {
    return await this.firebaseService.createUser(email, name);
  }

  async getUser(userId: string): Promise<User | null> {
    return await this.firebaseService.getUser(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.firebaseService.getUserByEmail(email);
  }
} 