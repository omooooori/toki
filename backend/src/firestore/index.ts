import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDKの初期化
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }
  return admin;
};

// Firestoreインスタンスの取得
export const getFirestoreInstance = () => {
  initializeFirebase();
  return getFirestore();
};

// Firebase Admin SDKのエクスポート
export { admin }; 