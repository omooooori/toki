import { OpenAIService } from './openai.service';
import { AIServiceConfig, DiaryGenerationInput, DiaryGenerationResult, AIAnalysisResult } from '../types/ai.types';

export type AIServiceType = 'openai';

export declare class DiaryGeneratorService {
    private openaiService?: OpenAIService;
    setOpenAIConfig(config: AIServiceConfig): void;
    generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult>;
    analyzeDiary(content: string): Promise<AIAnalysisResult>;
    getAvailableServices(): AIServiceType[];
}
//# sourceMappingURL=diary-generator.service.d.ts.map