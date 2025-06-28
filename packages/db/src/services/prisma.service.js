"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const client_1 = require("@prisma/client");
class PrismaService {
    constructor(config) {
        if (!config.prisma) {
            throw new Error('Prisma設定が提供されていません');
        }
        this.prisma = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: config.prisma.databaseUrl,
                },
            },
        });
    }
    // ユーザー関連
    async createUser(email, name) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    name,
                },
            });
            return {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            console.error('ユーザー作成エラー:', error);
            throw new Error('ユーザーの作成に失敗しました');
        }
    }
    async getUser(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            console.error('ユーザー取得エラー:', error);
            throw new Error('ユーザーの取得に失敗しました');
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            console.error('ユーザー取得エラー:', error);
            throw new Error('ユーザーの取得に失敗しました');
        }
    }
    // 日記関連
    async createDiary(input) {
        try {
            const diary = await this.prisma.diary.create({
                data: {
                    userId: input.userId,
                    content: input.content,
                    location: input.location ? {
                        create: {
                            latitude: input.location.latitude,
                            longitude: input.location.longitude,
                            address: input.location.address,
                            placeName: input.location.placeName,
                        },
                    } : undefined,
                    photos: input.photoUrls ? {
                        create: input.photoUrls.map((url, index) => ({
                            url,
                            takenAt: new Date(),
                        })),
                    } : undefined,
                },
                include: {
                    location: true,
                    photos: true,
                    aiAnalysis: true,
                },
            });
            return this.mapPrismaDiaryToDiary(diary);
        }
        catch (error) {
            console.error('日記作成エラー:', error);
            throw new Error('日記の作成に失敗しました');
        }
    }
    async getDiary(diaryId) {
        try {
            const diary = await this.prisma.diary.findUnique({
                where: { id: diaryId },
                include: {
                    location: true,
                    photos: true,
                    aiAnalysis: true,
                },
            });
            if (!diary) {
                return null;
            }
            return this.mapPrismaDiaryToDiary(diary);
        }
        catch (error) {
            console.error('日記取得エラー:', error);
            throw new Error('日記の取得に失敗しました');
        }
    }
    async getDiaries(options) {
        try {
            const where = {
                userId: options.userId,
            };
            if (options.startDate || options.endDate) {
                where.createdAt = {};
                if (options.startDate) {
                    where.createdAt.gte = options.startDate;
                }
                if (options.endDate) {
                    where.createdAt.lte = options.endDate;
                }
            }
            const diaries = await this.prisma.diary.findMany({
                where,
                include: {
                    location: true,
                    photos: true,
                    aiAnalysis: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: options.limit,
                skip: options.offset,
            });
            return diaries.map(diary => this.mapPrismaDiaryToDiary(diary));
        }
        catch (error) {
            console.error('日記一覧取得エラー:', error);
            throw new Error('日記一覧の取得に失敗しました');
        }
    }
    async updateDiary(diaryId, input) {
        try {
            const updateData = {
                content: input.content,
                updatedAt: new Date(),
            };
            if (input.location) {
                updateData.location = {
                    upsert: {
                        create: {
                            latitude: input.location.latitude,
                            longitude: input.location.longitude,
                            address: input.location.address,
                            placeName: input.location.placeName,
                        },
                        update: {
                            latitude: input.location.latitude,
                            longitude: input.location.longitude,
                            address: input.location.address,
                            placeName: input.location.placeName,
                        },
                    },
                };
            }
            if (input.aiAnalysis) {
                updateData.aiAnalysis = {
                    upsert: {
                        create: {
                            sentiment: input.aiAnalysis.sentiment,
                            topics: input.aiAnalysis.topics,
                            summary: input.aiAnalysis.summary,
                            suggestions: input.aiAnalysis.suggestions,
                        },
                        update: {
                            sentiment: input.aiAnalysis.sentiment,
                            topics: input.aiAnalysis.topics,
                            summary: input.aiAnalysis.summary,
                            suggestions: input.aiAnalysis.suggestions,
                        },
                    },
                };
            }
            const diary = await this.prisma.diary.update({
                where: { id: diaryId },
                data: updateData,
                include: {
                    location: true,
                    photos: true,
                    aiAnalysis: true,
                },
            });
            return this.mapPrismaDiaryToDiary(diary);
        }
        catch (error) {
            console.error('日記更新エラー:', error);
            throw new Error('日記の更新に失敗しました');
        }
    }
    async deleteDiary(diaryId) {
        try {
            await this.prisma.diary.delete({
                where: { id: diaryId },
            });
            return true;
        }
        catch (error) {
            console.error('日記削除エラー:', error);
            throw new Error('日記の削除に失敗しました');
        }
    }
    mapPrismaDiaryToDiary(prismaDiary) {
        return {
            id: prismaDiary.id,
            userId: prismaDiary.userId,
            content: prismaDiary.content,
            location: prismaDiary.location ? {
                latitude: prismaDiary.location.latitude,
                longitude: prismaDiary.location.longitude,
                address: prismaDiary.location.address,
                placeName: prismaDiary.location.placeName,
            } : undefined,
            photos: prismaDiary.photos?.map((photo) => ({
                id: photo.id,
                url: photo.url,
                thumbnailUrl: photo.thumbnailUrl,
                takenAt: photo.takenAt,
                location: photo.location ? {
                    latitude: photo.location.latitude,
                    longitude: photo.location.longitude,
                    address: photo.location.address,
                    placeName: photo.location.placeName,
                } : undefined,
            })) || [],
            aiAnalysis: prismaDiary.aiAnalysis ? {
                sentiment: prismaDiary.aiAnalysis.sentiment,
                topics: prismaDiary.aiAnalysis.topics,
                summary: prismaDiary.aiAnalysis.summary,
                suggestions: prismaDiary.aiAnalysis.suggestions,
            } : undefined,
            createdAt: prismaDiary.createdAt,
            updatedAt: prismaDiary.updatedAt,
        };
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
}
exports.PrismaService = PrismaService;
//# sourceMappingURL=prisma.service.js.map