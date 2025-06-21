import { z } from 'zod';

export const sentimentSchema = z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']);

export const aiAnalysisSchema = z.object({
  id: z.string().uuid(),
  diaryId: z.string().uuid(),
  sentiment: sentimentSchema,
  topics: z.array(z.string().min(1, 'トピックは必須です')),
  summary: z.string().optional(),
  suggestions: z.array(z.string().min(1, '提案は必須です')),
  createdAt: z.date(),
});

export const createAIAnalysisSchema = z.object({
  diaryId: z.string().uuid(),
  content: z.string().min(10, '内容は10文字以上で入力してください'),
});

export type AIAnalysisInput = z.infer<typeof aiAnalysisSchema>;
export type CreateAIAnalysisInput = z.infer<typeof createAIAnalysisSchema>;
export type SentimentInput = z.infer<typeof sentimentSchema>; 