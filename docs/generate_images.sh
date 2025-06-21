#!/bin/bash

# PlantUMLで画像を生成するスクリプト
# 必要な依存関係: PlantUML (Java + Graphviz)

set -e

echo "🚀 PlantUML画像生成を開始します..."

# diagramsディレクトリに移動
cd "$(dirname "$0")/diagrams"

# PlantUMLファイルの一覧を取得
pu_files=$(find . -name "*.pu" -type f)

if [ -z "$pu_files" ]; then
    echo "❌ .puファイルが見つかりません"
    exit 1
fi

# 各.puファイルをPNGに変換
for pu_file in $pu_files; do
    echo "📝 処理中: $pu_file"
    
    # ファイル名から拡張子を除去
    base_name=$(basename "$pu_file" .pu)
    
    # PNGファイルを生成
    plantuml -tpng "$pu_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ 生成完了: ${base_name}.png"
    else
        echo "❌ 生成失敗: $pu_file"
    fi
done

echo "🎉 画像生成が完了しました！"

# 生成されたファイルの一覧を表示
echo "📋 生成されたファイル:"
ls -la *.png 2>/dev/null || echo "PNGファイルが見つかりません" 