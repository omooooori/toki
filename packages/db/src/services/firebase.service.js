"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
class FirebaseService {
    constructor(config) {
        if (!config.firebase) {
            throw new Error('Firebase設定が提供されていません');
        }
        const { projectId, privateKey, clientEmail } = config.firebase;
        // 既存のアプリがある場合は使用
        const apps = (0, app_1.getApps)();
        if (apps.length > 0) {
            this.app = apps[0];
        }
        else {
            this.app = (0, app_1.initializeApp)({
                credential: (0, app_1.cert)({
                    projectId,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                    clientEmail,
                }),
            });
        }
        this.firestore = (0, firestore_1.getFirestore)(this.app);
        this.auth = (0, auth_1.getAuth)(this.app);
    }
    // ユーザー関連
    async createUser(email, name) {
        try {
            const userRecord = await this.auth.createUser({
                email,
                displayName: name,
            });
            const user = {
                id: userRecord.uid,
                email: userRecord.email,
                name: userRecord.displayName || undefined,
                createdAt: new Date(userRecord.metadata.creationTime),
                updatedAt: new Date(),
            };
            // Firestoreにユーザー情報を保存
            await this.firestore.collection('users').doc(user.id).set(user);
            return user;
        }
        catch (error) {
            console.error('ユーザー作成エラー:', error);
            throw new Error('ユーザーの作成に失敗しました');
        }
    }
    async getUser(userId) {
        try {
            const doc = await this.firestore.collection('users').doc(userId).get();
            if (!doc.exists) {
                return null;
            }
            return doc.data();
        }
        catch (error) {
            console.error('ユーザー取得エラー:', error);
            throw new Error('ユーザーの取得に失敗しました');
        }
    }
    async getUserByEmail(email) {
        try {
            const snapshot = await this.firestore
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();
            if (snapshot.empty) {
                return null;
            }
            return snapshot.docs[0].data();
        }
        catch (error) {
            console.error('ユーザー取得エラー:', error);
            throw new Error('ユーザーの取得に失敗しました');
        }
    }
    // 日記関連
    async createDiary(input) {
        try {
            const diary = {
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
        }
        catch (error) {
            console.error('日記作成エラー:', error);
            throw new Error('日記の作成に失敗しました');
        }
    }
    async getDiary(diaryId) {
        try {
            const doc = await this.firestore.collection('diaries').doc(diaryId).get();
            if (!doc.exists) {
                return null;
            }
            return { id: doc.id, ...doc.data() };
        }
        catch (error) {
            console.error('日記取得エラー:', error);
            throw new Error('日記の取得に失敗しました');
        }
    }
    async getDiaries(options) {
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
            }));
        }
        catch (error) {
            console.error('日記一覧取得エラー:', error);
            throw new Error('日記一覧の取得に失敗しました');
        }
    }
    async updateDiary(diaryId, input) {
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
        }
        catch (error) {
            console.error('日記更新エラー:', error);
            throw new Error('日記の更新に失敗しました');
        }
    }
    async deleteDiary(diaryId) {
        try {
            await this.firestore.collection('diaries').doc(diaryId).delete();
            return true;
        }
        catch (error) {
            console.error('日記削除エラー:', error);
            throw new Error('日記の削除に失敗しました');
        }
    }
    // 認証関連
    async verifyToken(token) {
        try {
            const decodedToken = await this.auth.verifyIdToken(token);
            return decodedToken.uid;
        }
        catch (error) {
            console.error('トークン検証エラー:', error);
            throw new Error('トークンの検証に失敗しました');
        }
    }
}
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase.service.js.map