# Toki AI Package

AI機能を提供するパッケージです。

## 技術スタック

- **AI Provider**: OpenAI API / Vertex AI
- **言語**: TypeScript
- **プロンプト管理**: LangChain

## セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
```

## プロジェクト構造

```
src/
├── index.ts
├── providers/
│   ├── openai.ts
│   ├── vertex-ai.ts
│   └── base-provider.ts
├── services/
│   ├── diary-analysis.ts
│   ├── sentiment-analysis.ts
│   ├── content-generation.ts
│   └── summarization.ts
├── prompts/
│   ├── diary-analysis.prompt
│   ├── sentiment-analysis.prompt
│   └── content-generation.prompt
├── types/
│   ├── ai-response.ts
│   └── analysis-result.ts
└── utils/
    ├── prompt-builder.ts
    └── response-parser.ts
```

## 機能

- **日記分析**: 感情分析、トピック抽出
- **内容生成**: AIによる日記の要約・提案
- **感情分析**: 日記の感情傾向を分析
- **要約**: 長文の日記を要約

## 環境変数

```env
OPENAI_API_KEY=your_openai_api_key
VERTEX_AI_PROJECT_ID=your_vertex_ai_project_id
VERTEX_AI_LOCATION=us-central1
```

## 使用方法

```typescript
import { DiaryAnalysisService } from '@toki/ai'

const analysisService = new DiaryAnalysisService()

// 日記の分析
const analysis = await analysisService.analyzeDiary({
  content: '今日の日記内容...',
  userId: 'user123'
})
``` 