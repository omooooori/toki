"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryRepository = void 0;
const firebase_service_1 = require("../services/firebase.service");
const prisma_service_1 = require("../services/prisma.service");
class DiaryRepository {
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
    async createDiary(input) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.createDiary(input);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.createDiary(input);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async getDiary(diaryId) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.getDiary(diaryId);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.getDiary(diaryId);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async getDiaries(options) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.getDiaries(options);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.getDiaries(options);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async updateDiary(diaryId, input) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.updateDiary(diaryId, input);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.updateDiary(diaryId, input);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async deleteDiary(diaryId) {
        if (this.databaseType === 'firebase' && this.firebaseService) {
            return await this.firebaseService.deleteDiary(diaryId);
        }
        else if (this.databaseType === 'prisma' && this.prismaService) {
            return await this.prismaService.deleteDiary(diaryId);
        }
        throw new Error('データベースサービスが初期化されていません');
    }
    async getDiariesByDateRange(userId, startDate, endDate) {
        return await this.getDiaries({
            userId,
            startDate,
            endDate,
        });
    }
    async getRecentDiaries(userId, limit = 10) {
        return await this.getDiaries({
            userId,
            limit,
        });
    }
    async disconnect() {
        if (this.databaseType === 'prisma' && this.prismaService) {
            await this.prismaService.disconnect();
        }
    }
}
exports.DiaryRepository = DiaryRepository;
//# sourceMappingURL=diary.repository.js.map