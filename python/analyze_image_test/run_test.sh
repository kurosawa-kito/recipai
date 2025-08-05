#!/bin/bash

# 冷蔵庫食材検出テスト実行スクリプト

echo "🚀 冷蔵庫食材検出テストを開始します"
echo "=================================="

# 現在のディレクトリを保存
ORIGINAL_DIR=$(pwd)

# テストディレクトリに移動
cd "$(dirname "$0")"

echo "📦 必要なライブラリをインストール中..."

# 仮想環境が存在しない場合は作成
if [ ! -d "venv" ]; then
    echo "🔧 仮想環境を作成中..."
    python3 -m venv venv
fi

# 仮想環境をアクティベート
source venv/bin/activate

# ライブラリをインストール
pip install -r requirements.txt

echo "✅ ライブラリのインストールが完了しました"
echo ""

# テスト画像ディレクトリをチェック
TEST_IMAGE_DIR="../../public/images/analyze_image_test"
if [ ! "$(ls -A $TEST_IMAGE_DIR 2>/dev/null)" ]; then
    echo "⚠️  テスト画像が見つかりません"
    echo "以下のディレクトリに冷蔵庫の画像を配置してください:"
    echo "   $(realpath $TEST_IMAGE_DIR)"
    echo ""
    echo "サポートされる画像形式: .jpg, .jpeg, .png, .bmp"
    echo ""
    echo "画像を配置後、再度このスクリプトを実行してください。"
    exit 1
fi

echo "🧪 テストを実行中..."
python test_fridge_detection.py

# 元のディレクトリに戻る
cd "$ORIGINAL_DIR"

echo ""
echo "🏁 テスト完了"
