import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { DatabaseConfig, User, Diary, CreateDiaryInput, UpdateDiaryInput, DiaryQueryOptions } from '../types/database.types';

export class FirebaseService {
  private app: App;
  private firestore: Firestore;
  private auth: Auth;

  constructor(config: DatabaseConfig) {
    if (!config.firebase) {
      throw new Error('Firebase設定が提供されていません');
    }

    const { projectId, privateKey, clientEmail } = config.firebase;

    // 既存のアプリがある場合は使用
    const apps = getApps();
    if (apps.length > 0) {
      this.app = apps[0];
    } else {
      this.app = initializeApp({
        credential: cert({
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }),
      });
    }

    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  // ユーザー関連
  async createUser(email: string, name?: string): Promise<User> {
    try {
      const userRecord = await this.auth.createUser({
        email,
        displayName: name,
      });

      const user: User = {
        id: userRecord.uid,
        email: userRecord.email!,
        name: userRecord.displayName || undefined,
        createdAt: new Date(userRecord.metadata.creationTime!),
        updatedAt: new Date(),
      };

      // Firestoreにユーザー情報を保存
      await this.firestore.collection('users').doc(user.id).set(user);

      return user;
    } catch (error) {
      console.error('ユーザー作成エラー:', error);
      throw new Error('ユーザーの作成に失敗しました');
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const doc = await this.firestore.collection('users').doc(userId).get();
      if (!doc.exists) {
        return null;
      }
      return doc.data() as User;
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      throw new Error('ユーザーの取得に失敗しました');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const snapshot = await this.firestore
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs[0].data() as User;
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      throw new Error('ユーザーの取得に失敗しました');
    }
  }

  // 日記関連
  async createDiary(input: CreateDiaryInput): Promise<Diary> {
    try {
      const diary: Omit<Diary, 'id'> = {
        userId: input.userId,
        content: input.content,
        location: input.location,
        photos: input.photoUrls?.map((url, index) => ({
          id: `photo_${Date.now()}_${index}`,
          url,
          takenAt: new Date(),
        })) || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await this.firestore.collection('diaries').add(diary);
      
      return {
        id: docRef.id,
        ...diary,
      };
    } catch (error) {
      console.error('日記作成エラー:', error);
      throw new Error('日記の作成に失敗しました');
    }
  }

  async getDiary(diaryId: string): Promise<Diary | null> {
    try {
      const doc = await this.firestore.collection('diaries').doc(diaryId).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() } as Diary;
    } catch (error) {
      console.error('日記取得エラー:', error);
      throw new Error('日記の取得に失敗しました');
    }
  }

  async getDiaries(options: DiaryQueryOptions): Promise<Diary[]> {
    try {
      let query = this.firestore.collection('diaries').where('userId', '==', options.userId);

      if (options.startDate) {
        query = query.where('createdAt', '>=', options.startDate);
      }

      if (options.endDate) {
        query = query.where('createdAt', '<=', options.endDate);
      }

      query = query.orderBy('createdAt', 'desc');

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.offset(options.offset);
      }

      const snapshot = await query.get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Diary[];
    } catch (error) {
      console.error('日記一覧取得エラー:', error);
      throw new Error('日記一覧の取得に失敗しました');
    }
  }

  async updateDiary(diaryId: string, input: UpdateDiaryInput): Promise<Diary> {
    try {
      const updateData = {
        ...input,
        updatedAt: new Date(),
      };

      await this.firestore.collection('diaries').doc(diaryId).update(updateData);
      
      const updated = await this.getDiary(diaryId);
      if (!updated) {
        throw new Error('更新された日記が見つかりません');
      }

      return updated;
    } catch (error) {
      console.error('日記更新エラー:', error);
      throw new Error('日記の更新に失敗しました');
    }
  }

  async deleteDiary(diaryId: string): Promise<boolean> {
    try {
      await this.firestore.collection('diaries').doc(diaryId).delete();
      return true;
    } catch (error) {
      console.error('日記削除エラー:', error);
      throw new Error('日記の削除に失敗しました');
    }
  }

  // 認証関連
  async verifyToken(token: string): Promise<string> {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken.uid;
    } catch (error) {
      console.error('トークン検証エラー:', error);
      throw new Error('トークンの検証に失敗しました');
    }
  }
} 