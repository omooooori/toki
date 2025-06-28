import OpenAI from 'openai';
import { AIServiceConfig, DiaryGenerationInput, DiaryGenerationResult, AIAnalysisResult } from '../types/ai.types';
import { DIARY_GENERATION_PROMPT, DIARY_ANALYSIS_PROMPT } from '../utils/prompt-templates';

export class OpenAIService {
  private client: OpenAI;
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async generateDiary(input: DiaryGenerationInput): Promise<DiaryGenerationResult> {
    try {
      const prompt = this.buildDiaryGenerationPrompt(input);
      
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'あなたは親しみやすく、共感的な日記ライターです。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens || 1000,
        temperature: this.config.temperature || 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AIからの応答が空です');
      }

      return this.parseDiaryGenerationResponse(content);
    } catch (error) {
      console.error('日記生成エラー:', error);
      throw new Error('日記の生成に失敗しました');
    }
  }

  async analyzeDiary(content: string): Promise<AIAnalysisResult> {
    try {
      const prompt = DIARY_ANALYSIS_PROMPT.replace('{content}', content);
      
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'あなたは日記分析の専門家です。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens || 500,
        temperature: this.config.temperature || 0.3,
      });

      const responseContent = response.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('AIからの応答が空です');
      }

      return this.parseAnalysisResponse(responseContent);
    } catch (error) {
      console.error('日記分析エラー:', error);
      throw new Error('日記の分析に失敗しました');
    }
  }

  private buildDiaryGenerationPrompt(input: DiaryGenerationInput): string {
    const location = input.location 
      ? `${input.location.placeName || '不明な場所'} (${input.location.latitude}, ${input.location.longitude})`
      : '不明';
    
    const photoCount = input.photos?.length || 0;
    const eventCount = input.calendarEvents?.length || 0;
    const mood = input.userMood || '不明';
    const timestamp = input.timestamp.toLocaleString('ja-JP');

    return DIARY_GENERATION_PROMPT
      .replace('{location}', location)
      .replace('{photoCount}', photoCount.toString())
      .replace('{eventCount}', eventCount.toString())
      .replace('{mood}', mood)
      .replace('{timestamp}', timestamp);
  }

  private parseDiaryGenerationResponse(content: string): DiaryGenerationResult {
    try {
      // JSON部分を抽出
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('JSON形式の応答が見つかりません');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        content: parsed.content || '',
        sentiment: parsed.sentiment || 'NEUTRAL',
        topics: parsed.topics || [],
        summary: parsed.summary || '',
        suggestions: parsed.suggestions || [],
      };
    } catch (error) {
      console.error('応答の解析エラー:', error);
      // フォールバック: 生のテキストを日記内容として使用
      return {
        content: content,
        sentiment: 'NEUTRAL',
        topics: [],
        summary: 'AIによる自動生成',
        suggestions: [],
      };
    }
  }

  private parseAnalysisResponse(content: string): AIAnalysisResult {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('JSON形式の応答が見つかりません');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        sentiment: parsed.sentiment || 'NEUTRAL',
        topics: parsed.topics || [],
        summary: parsed.summary || '',
        suggestions: parsed.suggestions || [],
        keywords: parsed.keywords || [],
      };
    } catch (error) {
      console.error('分析応答の解析エラー:', error);
      throw new Error('分析結果の解析に失敗しました');
    }
  }
} 