"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firebase_service_1 = require("../services/firebase.service");
const prisma_service_1 = require("../services/prisma.service");
class UserRepository {
    constructor(config) {
        this.databaseType = config.type;
        if (config.type === 'firebase') {
            this.firebaseService = new firebase_service_1.FirebaseService(config);
        }
        else if (config.type === 'prisma') {
            this.prismaService = new prisma_service_1.PrismaService(config);
        }
        else {
            throw new Error('サポートされていないデータベースタイプです');
        }
    }
    async createUser(email, name) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.createUser(email, name);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.createUser(email, name);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async getUser(userId) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.getUser(userId);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.getUser(userId);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async getUserByEmail(email) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.getUserByEmail(email);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.getUserByEmail(email);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async verifyToken(token) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.verifyToken(token);
        }
        throw new Error('トークン検証はFirebaseでのみサポートされています');
    }
    async disconnect() {
        if (this.databaseType === 'prisma' && this.prismaService) {
            await this.prismaService.disconnect();
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map