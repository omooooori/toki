import { OpenAIService } from './openai.service';
import { AIServiceConfig, DiaryGenerationInput, DiaryGenerationResult, AIAnalysisResult } from '../types/ai.types';

export type AIServiceType = 'openai';

export class DiaryGeneratorService {
  private openaiService?: OpenAIService;

  setOpenAIConfig(config: AIServiceConfig): void {
    this.openaiService = new OpenAIService(config);
  }

  async generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult> {
    if (!this.openaiService) {
      throw new Error('OpenAIサービスが未設定です');
    }
    return await this.openaiService.generateDiary(input);
  }

  async analyzeDiary(content: string): Promise<AIAnalysisResult> {
    if (!this.openaiService) {
      throw new Error('OpenAIサービスが未設定です');
    }
    return await this.openaiService.analyzeDiary(content);
  }

  getAvailableServices(): AIServiceType[] {
    return this.openaiService ? ['openai'] : [];
  }
} 
} 