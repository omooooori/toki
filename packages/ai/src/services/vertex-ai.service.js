"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexAIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const prompt_templates_1 = require("../utils/prompt-templates");
class VertexAIService {
    constructor(config) {
        this.config = config;
        this.genAI = new generative_ai_1.GoogleGenerativeAI(config.apiKey);
    }
    async generateDiary(input) {
        try {
            const prompt = this.buildDiaryGenerationPrompt(input);
            const model = this.genAI.getGenerativeModel({ model: this.config.model });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const content = response.text();
            if (!content) {
                throw new Error('AIからの応答が空です');
            }
            return this.parseDiaryGenerationResponse(content);
        }
        catch (error) {
            console.error('日記生成エラー:', error);
            throw new Error('日記の生成に失敗しました');
        }
    }
    async analyzeDiary(content) {
        try {
            const prompt = prompt_templates_1.DIARY_ANALYSIS_PROMPT.replace('{content}', content);
            const model = this.genAI.getGenerativeModel({ model: this.config.model });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseContent = response.text();
            if (!responseContent) {
                throw new Error('AIからの応答が空です');
            }
            return this.parseAnalysisResponse(responseContent);
        }
        catch (error) {
            console.error('日記分析エラー:', error);
            throw new Error('日記の分析に失敗しました');
        }
    }
    buildDiaryGenerationPrompt(input) {
        const location = input.location
            ? `${input.location.placeName || '不明な場所'} (${input.location.latitude}, ${input.location.longitude})`
            : '不明';
        const photoCount = input.photos?.length || 0;
        const eventCount = input.calendarEvents?.length || 0;
        const mood = input.userMood || '不明';
        const timestamp = input.timestamp.toLocaleString('ja-JP');
        return prompt_templates_1.DIARY_GENERATION_PROMPT
            .replace('{location}', location)
            .replace('{photoCount}', photoCount.toString())
            .replace('{eventCount}', eventCount.toString())
            .replace('{mood}', mood)
            .replace('{timestamp}', timestamp);
    }
    parseDiaryGenerationResponse(content) {
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
        }
        catch (error) {
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
    parseAnalysisResponse(content) {
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
        }
        catch (error) {
            console.error('分析応答の解析エラー:', error);
            throw new Error('分析結果の解析に失敗しました');
        }
    }
}
exports.VertexAIService = VertexAIService;
//# sourceMappingURL=vertex-ai.service.js.map