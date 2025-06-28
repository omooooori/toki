"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryGeneratorService = void 0;
const openai_service_1 = require("./openai.service");
const vertex_ai_service_1 = require("./vertex-ai.service");
class DiaryGeneratorService {
    constructor(defaultService = 'openai') {
        this.defaultService = defaultService;
    }
    setOpenAIConfig(config) {
        this.openaiService = new openai_service_1.OpenAIService(config);
    }
    setVertexAIConfig(config) {
        this.vertexAIService = new vertex_ai_service_1.VertexAIService(config);
    }
    async generateDiary(input, serviceType) {
        const service = serviceType || this.defaultService;
        try {
            switch (service) {
                case 'openai':
                    if (!this.openaiService) {
                        throw new Error('OpenAIサービスが設定されていません');
                    }
                    return await this.openaiService.generateDiary(input);
                case 'vertex-ai':
                    if (!this.vertexAIService) {
                        throw new Error('Vertex AIサービスが設定されていません');
                    }
                    return await this.vertexAIService.generateDiary(input);
                default:
                    throw new Error(`サポートされていないAIサービス: ${service}`);
            }
        }
        catch (error) {
            console.error(`日記生成エラー (${service}):`, error);
            // フォールバック: 別のサービスを試す
            if (service === 'openai' && this.vertexAIService) {
                console.log('OpenAIに失敗、Vertex AIにフォールバック');
                return await this.vertexAIService.generateDiary(input);
            }
            else if (service === 'vertex-ai' && this.openaiService) {
                console.log('Vertex AIに失敗、OpenAIにフォールバック');
                return await this.openaiService.generateDiary(input);
            }
            throw error;
        }
    }
    async analyzeDiary(content, serviceType) {
        const service = serviceType || this.defaultService;
        try {
            switch (service) {
                case 'openai':
                    if (!this.openaiService) {
                        throw new Error('OpenAIサービスが設定されていません');
                    }
                    return await this.openaiService.analyzeDiary(content);
                case 'vertex-ai':
                    if (!this.vertexAIService) {
                        throw new Error('Vertex AIサービスが設定されていません');
                    }
                    return await this.vertexAIService.analyzeDiary(content);
                default:
                    throw new Error(`サポートされていないAIサービス: ${service}`);
            }
        }
        catch (error) {
            console.error(`日記分析エラー (${service}):`, error);
            // フォールバック: 別のサービスを試す
            if (service === 'openai' && this.vertexAIService) {
                console.log('OpenAIに失敗、Vertex AIにフォールバック');
                return await this.vertexAIService.analyzeDiary(content);
            }
            else if (service === 'vertex-ai' && this.openaiService) {
                console.log('Vertex AIに失敗、OpenAIにフォールバック');
                return await this.openaiService.analyzeDiary(content);
            }
            throw error;
        }
    }
    async generateWeeklyHighlight(diaries) {
        // 週間ハイライト生成の実装
        // これは後で実装予定
        throw new Error('週間ハイライト生成は未実装です');
    }
    isServiceAvailable(serviceType) {
        switch (serviceType) {
            case 'openai':
                return !!this.openaiService;
            case 'vertex-ai':
                return !!this.vertexAIService;
            default:
                return false;
        }
    }
    getAvailableServices() {
        const services = [];
        if (this.openaiService)
            services.push('openai');
        if (this.vertexAIService)
            services.push('vertex-ai');
        return services;
    }
}
exports.DiaryGeneratorService = DiaryGeneratorService;
//# sourceMappingURL=diary-generator.service.js.map