"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiarySchema = exports.createDiarySchema = exports.diarySchema = exports.photoSchema = exports.locationSchema = void 0;
const zod_1 = require("zod");
exports.locationSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    address: zod_1.z.string().optional(),
    placeName: zod_1.z.string().optional(),
});
exports.photoSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    url: zod_1.z.string().url('有効なURLを入力してください'),
    thumbnailUrl: zod_1.z.string().url('有効なURLを入力してください').optional(),
    takenAt: zod_1.z.date().optional(),
    location: exports.locationSchema.optional(),
});
exports.diarySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(10, '日記は10文字以上で入力してください').max(10000, '日記は10000文字以内で入力してください'),
    location: exports.locationSchema.optional(),
    photos: zod_1.z.array(exports.photoSchema),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.createDiarySchema = zod_1.z.object({
    content: zod_1.z.string().min(10, '日記は10文字以上で入力してください').max(10000, '日記は10000文字以内で入力してください'),
    location: exports.locationSchema.optional(),
    photoUrls: zod_1.z.array(zod_1.z.string().url('有効なURLを入力してください')).optional(),
});
exports.updateDiarySchema = zod_1.z.object({
    content: zod_1.z.string().min(10, '日記は10文字以上で入力してください').max(10000, '日記は10000文字以内で入力してください').optional(),
    location: exports.locationSchema.optional(),
    photoUrls: zod_1.z.array(zod_1.z.string().url('有効なURLを入力してください')).optional(),
});
//# sourceMappingURL=diary.schema.js.map