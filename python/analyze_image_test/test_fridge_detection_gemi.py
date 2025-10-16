#!/usr/bin/env python3
"""
Gemini API を使用した冷蔵庫食材検出テストコード
"""

import os
import sys

# gRPCのDNS解決に関する問題を回避するため、ネイティブのリゾルバを使用するよう設定
os.environ['GRPC_DNS_RESOLVER'] = 'native'

import re
import json
import argparse
from typing import List, Dict, Any, Optional

try:
    import google.generativeai as genai
    from google.api_core.exceptions import ServiceUnavailable
    from PIL import Image
except ImportError as e:
    print(f"必要なライブラリがインストールされていません: {e}")    
    if "PIL" in str(e) or "_imaging" in str(e):
        print("Pillow (PIL) 関連のエラーです。libtiff が正しくインストールされているか確認してください。")

    print("以下のコマンドでインストールしてください:")
    print("pip install google-generativeai Pillow")
    sys.exit(1)

# プロンプトを定数として定義
# 出力形式を安定させるために、具体的な指示と例を含める
PROMPT_TEXT = """この画像は冷蔵庫の中身です。写っている食材を特定し、一般的な食材名のリストをJSON形式で返してください。
商品名やブランド名は含めず、例えば「卵」「牛乳」「納豆」「キャベツ」のように、基本的な食材名でお願いします。
他の説明テキストは含めず、JSONオブジェクトのみを返してください。

出力形式の例:
```json
{
  "ingredients": [
    "卵",
    "牛乳",
    "納豆",
    "キャベツ",
    "トマト"
  ]
}
```
"""

class GeminiFridgeDetector:
    """Gemini API を使用して冷蔵庫内の食材を検出するクラス"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Args:
            api_key (Optional[str]): Google Gemini API キー。
                                     Noneの場合は環境変数 `GEMINI_API_KEY` を参照します。
        """
        # 優先順位: 引数 > 環境変数
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            # デモ用に提供されたキーをフォールバックとして使用
            self.api_key = "AIzaSyAJKlM5SpFtiDBdBcAkP84v7wiB7m3wSkw"
            print("⚠️  APIキーが引数または環境変数で指定されていません。デモ用のキーを使用します。")

        self.model = None
        self._check_network()
        self._configure_api()
        self._load_model()

    def _check_network(self):
        """
        APIエンドポイントへのDNS解決を試みることで、基本的なネットワーク接続を確認します。
        これにより、タイムアウトが長いAPIコールを実行する前に、一般的なネットワーク問題を早期に検出します。
        """
        import socket
        hostname = "generativelanguage.googleapis.com"
        try:
            print(f"🌐 ネットワーク接続を確認中 ({hostname})...")
            socket.gethostbyname(hostname)
            print("✅ ネットワーク接続は問題ありません。")
        except socket.gaierror as e:
            print(f"❌ DNS名前解決に失敗しました: {hostname}\n   お使いのコンピュータのインターネット接続、DNS設定、ファイアウォール、またはプロキシ設定を確認してください。")
            raise ConnectionError(f"DNS resolution failed for {hostname}. Please check your network settings.") from e

    def _configure_api(self):
        """APIキーを設定"""
        try:
            genai.configure(api_key=self.api_key)
        except Exception as e:
            print(f"❌ APIキーの設定に失敗しました: {e}")
            raise

    def _load_model(self):
        """モデルをロード"""
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("✅ Geminiモデル (gemini-1.5-flash) の読み込みが完了しました")
        except Exception as e:
            print(f"❌ モデルの読み込みに失敗しました: {e}")
            raise

    def detect_ingredients(self, image_path: str) -> Dict[str, Any]:
        """
        画像から食材を検出
        
        Args:
            image_path (str): 画像ファイルのパス
            
        Returns:
            検出結果の辞書
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"画像ファイルが見つかりません: {image_path}")

        print(f"📸 画像を読み込み中: {image_path}")
        try:
            img = Image.open(image_path)
        except Exception as e:
            raise IOError(f"画像の読み込みに失敗しました: {image_path}, エラー: {e}")

        print("🔍 Gemini API に問い合わせ中...")
        try:
            # ネットワークが不安定な場合に備えて、リクエストにタイムアウトを設定 (秒)
            response = self.model.generate_content(
                [PROMPT_TEXT, img],
                request_options={"timeout": 180.0}
            )
            
            # レスポンスからテキスト部分を抽出
            response_text = response.text
            
            # Markdownのコードブロックを除去
            # ```json ... ``` または ``` ... ``` の中身を抽出
            match = re.search(r"```(json)?\n(.*?)\n```", response_text, re.DOTALL)
            if match:
                json_str = match.group(2)
            else:
                json_str = response_text
            
            # JSONとしてパース
            result_json = json.loads(json_str.strip())
            
            ingredients = result_json.get("ingredients", [])
            
            return {
                'image_path': image_path,
                'ingredients': ingredients,
                'raw_response': response.text
            }

        except ServiceUnavailable as e:
            print(f"❌ Gemini APIサービスが利用できません。ネットワークの問題またはAPI側の障害の可能性があります。")
            print(f"   詳細: {e}")
            return {
                'image_path': image_path,
                'ingredients': [],
                'raw_response': str(e),
                'error': 'ServiceUnavailable'
            }
        except json.JSONDecodeError:
            print(f"❌ APIからのレスポンスのJSONパースに失敗しました。")
            print(f"   RAWレスポンス: {response.text}")
            return {
                'image_path': image_path,
                'ingredients': [],
                'raw_response': response.text,
                'error': 'JSONDecodeError'
            }
        except Exception as e:
            print(f"❌ Gemini API での推論に失敗しました: {e}")
            raise


def test_fridge_detection_gemini(test_images_dir: Optional[str] = None, api_key: Optional[str] = None) -> Dict[str, Any]:
    """テスト実行関数。すべての画像から検出された食材を一つのユニークなリストとして返す。"""
    print("=" * 60)
    print("🧪 Geminiによる冷蔵庫食材検出テスト開始")
    print("=" * 60)

    # --dirが指定されなかった場合のデフォルトパスを設定
    if test_images_dir is None:
        # 別のテストスクリプトで使われているデフォルトパスを参考に設定
        test_images_dir = "/Users/bobsup/Projects/recipai/public/images/analyze_image_test"
        print(f"ℹ️  --dirが指定されていないため、デフォルトのディレクトリを使用します: {test_images_dir}")

    if not os.path.isdir(test_images_dir):
        print(f"❌ 指定されたディレクトリが見つかりません: {test_images_dir}")
        return {'success': False, 'all_ingredients': []}

    # 検出器を初期化
    try:
        detector = GeminiFridgeDetector(api_key=api_key)
    except ConnectionError:
        print("❌ ネットワーク接続に問題があるため、テストを中止します。")
        return {'success': False, 'all_ingredients': []}
    except Exception as e:
        print(f"❌ 検出器の初期化に失敗しました: {e}")
        return {'success': False, 'all_ingredients': []}

    # テスト画像を検索
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    test_images = [
        os.path.join(test_images_dir, f)
        for f in os.listdir(test_images_dir)
        if any(f.lower().endswith(ext) for ext in image_extensions)
    ]

    if not test_images:
        print(f"⚠️  テスト画像が見つかりません: {test_images_dir}")
        return {'success': False, 'all_ingredients': []}

    print(f"📁 {len(test_images)}個のテスト画像が見つかりました")
    for p in test_images:
        print(f"   - {os.path.basename(p)}")

    # すべての食材を収集するためのセット（重複を避ける）
    all_ingredients = set()
    # 各画像に対してテスト実行
    success_count = 0
    for i, image_path in enumerate(test_images, 1):
        print(f"\n--- テスト {i}/{len(test_images)}: {os.path.basename(image_path)} ---")
        try:
            result = detector.detect_ingredients(image_path)
            
            if result.get('error'):
                print(f"   -> 失敗 ({result.get('error')})")
                continue

            ingredients = result['ingredients']
            print(f"🎯 検出された食材数: {len(ingredients)}")
            
            if ingredients:
                print("📋 検出された食材リスト:")
                for ingredient in ingredients:
                    print(f"   - {ingredient}")
                all_ingredients.update(ingredients)
            else:
                print("   食材が検出されませんでした。")
            
            success_count += 1
            
        except Exception as e:
            print(f"❌ テスト{i}でエラーが発生しました: {e}")

    print("\n" + "=" * 60)
    print(f"🏁 テスト完了: {success_count}/{len(test_images)} 成功")
    print("=" * 60)
    
    return {
        'success': success_count == len(test_images),
        'all_ingredients': sorted(list(all_ingredients))
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gemini API を使用した冷蔵庫食材検出テスト")
    parser.add_argument(
        "--dir", "-d", 
        default=None,
        help="テスト画像が含まれるディレクトリのパス (省略時はデフォルトパスを使用)"
    )
    parser.add_argument(
        "--api-key", 
        help="Google Gemini API キー (省略時は環境変数 GEMINI_API_KEY を使用)"
    )
    args = parser.parse_args()

    # 環境変数にAPIキーを設定する例
    # ユーザーがコマンドラインで指定しない場合、このキーが使われる
    if not args.api_key and not os.environ.get("GEMINI_API_KEY"):
        print("🔑 環境変数 `GEMINI_API_KEY` を設定します。")
        os.environ["GEMINI_API_KEY"] = "AIzaSyDOFONEB_t5Mf42k2MFmEy2ZxtI-tL4bBw"

    result = test_fridge_detection_gemini(test_images_dir=args.dir, api_key=args.api_key)
    
    if result['all_ingredients']:
        print("\n" + "=" * 60)
        print("📋 すべての画像から検出されたユニークな食材リスト:")
        for ingredient in result['all_ingredients']:
            print(f"   - {ingredient}")
        print("=" * 60)

    if result['success']:
        print("✅ 全てのテストが成功しました！")
        sys.exit(0)
    else:
        print("❌ 一部のテストが失敗しました")
        sys.exit(1)