"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAIAnalysisSchema = exports.aiAnalysisSchema = exports.sentimentSchema = void 0;
const zod_1 = require("zod");
exports.sentimentSchema = zod_1.z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']);
exports.aiAnalysisSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    diaryId: zod_1.z.string().uuid(),
    sentiment: exports.sentimentSchema,
    topics: zod_1.z.array(zod_1.z.string().min(1, 'トピックは必須です')),
    summary: zod_1.z.string().optional(),
    suggestions: zod_1.z.array(zod_1.z.string().min(1, '提案は必須です')),
    createdAt: zod_1.z.date(),
});
exports.createAIAnalysisSchema = zod_1.z.object({
    diaryId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(10, '内容は10文字以上で入力してください'),
});
//# sourceMappingURL=ai-analysis.schema.js.map