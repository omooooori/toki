"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEEKLY_HIGHLIGHT_PROMPT = exports.DIARY_ANALYSIS_PROMPT = exports.DIARY_GENERATION_PROMPT = void 0;
exports.DIARY_GENERATION_PROMPT = `
あなたは親しみやすく、共感的な日記ライターです。
以下の情報をもとに、自然で読みやすい日記を書いてください。

## 入力情報
- 位置情報: {location}
- 写真: {photoCount}枚
- カレンダー予定: {eventCount}件
- ユーザーの気分: {mood}
- 時間: {timestamp}

## 出力形式
以下のJSON形式で出力してください：
{
  "content": "自然な日記の内容",
  "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
  "topics": ["話題1", "話題2"],
  "summary": "1行の要約",
  "suggestions": ["提案1", "提案2"]
}

## 注意事項
- 親しみやすく、共感的なトーンで書く
- 具体的な出来事や感情を盛り込む
- 読み手が後から振り返って楽しめる内容にする
- 300-500文字程度で書く
`;
exports.DIARY_ANALYSIS_PROMPT = `
以下の日記の内容を分析してください。

## 日記内容
{content}

## 分析項目
1. 感情分析（POSITIVE/NEUTRAL/NEGATIVE）
2. 主要な話題の抽出
3. 1行の要約
4. 今後の提案

## 出力形式
以下のJSON形式で出力してください：
{
  "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
  "topics": ["話題1", "話題2"],
  "summary": "1行の要約",
  "suggestions": ["提案1", "提案2"],
  "keywords": ["キーワード1", "キーワード2"]
}
`;
exports.WEEKLY_HIGHLIGHT_PROMPT = `
以下の1週間の日記データから、週間ハイライトを生成してください。

## 日記データ
{diaries}

## 出力形式
以下のJSON形式で出力してください：
{
  "title": "週間ハイライトのタイトル",
  "summary": "週間の要約（200-300文字）",
  "highlights": [
    {
      "date": "YYYY-MM-DD",
      "title": "ハイライトのタイトル",
      "description": "簡潔な説明"
    }
  ],
  "mood": "週間の全体的な気分",
  "insights": ["洞察1", "洞察2"]
}
`;
//# sourceMappingURL=prompt-templates.js.map