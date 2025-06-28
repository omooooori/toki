import { AIServiceConfig, DiaryGenerationInput, DiaryGenerationResult, AIAnalysisResult } from '../types/ai.types';
export declare class OpenAIService {
    private client;
    private config;
    constructor(config: AIServiceConfig);
    generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult>;
    analyzeDiary(content: string): Promise<AIAnalysisResult>;
    private buildDiaryGenerationPrompt;
    private parseDiaryGenerationResponse;
    private parseAnalysisResponse;
}
//# sourceMappingURL=openai.service.d.ts.map