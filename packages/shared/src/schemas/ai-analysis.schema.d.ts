import { z } from 'zod';
export declare const sentimentSchema: z.ZodEnum<["POSITIVE", "NEUTRAL", "NEGATIVE"]>;
export declare const aiAnalysisSchema: z.ZodObject<{
    id: z.ZodString;
    diaryId: z.ZodString;
    sentiment: z.ZodEnum<["POSITIVE", "NEUTRAL", "NEGATIVE"]>;
    topics: z.ZodArray<z.ZodString, "many">;
    summary: z.ZodOptional<z.ZodString>;
    suggestions: z.ZodArray<z.ZodString, "many">;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    topics: string[];
    suggestions: string[];
    diaryId: string;
    summary?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    topics: string[];
    suggestions: string[];
    diaryId: string;
    summary?: string | undefined;
}>;
export declare const createAIAnalysisSchema: z.ZodObject<{
    diaryId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    diaryId: string;
}, {
    content: string;
    diaryId: string;
}>;
export type AIAnalysisInput = z.infer<typeof aiAnalysisSchema>;
export type CreateAIAnalysisInput = z.infer<typeof createAIAnalysisSchema>;
export type SentimentInput = z.infer<typeof sentimentSchema>;
//# sourceMappingURL=ai-analysis.schema.d.ts.map