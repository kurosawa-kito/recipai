#!/usr/bin/env python3
"""
冷蔵庫食材検出テストコード
Roboflow fridgevision/3 モデルを使用して冷蔵庫内の食材を検出
"""

import os
import sys
import cv2
import numpy as np
from typing import List, Dict, Any

try:
    from inference import get_model
    import supervision as sv
except ImportError as e:
    print(f"必要なライブラリがインストールされていません: {e}")
    print("以下のコマンドでインストールしてください:")
    print("pip install roboflow inference supervision opencv-python")
    sys.exit(1)

class FridgeDetector:
    """冷蔵庫内食材検出クラス"""
    
    def __init__(self, api_key: str = "e7869ldGYVI1OHMIBFDz"):
        """
        Args:
            api_key: Roboflow API キー
        """
        self.api_key = api_key
        self.model = None
        self.load_model()
    
    def load_model(self):
        """モデルをロード"""
        try:
            self.model = get_model(
                model_id="fridgevision/3", 
                api_key=self.api_key
            )
            print("✅ モデルの読み込みが完了しました")
        except Exception as e:
            print(f"❌ モデルの読み込みに失敗しました: {e}")
            raise
    
    def detect_ingredients(self, image_path: str) -> Dict[str, Any]:
        """
        画像から食材を検出
        
        Args:
            image_path: 画像ファイルのパス
            
        Returns:
            検出結果の辞書
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"画像ファイルが見つかりません: {image_path}")
        
        # 画像を読み込み
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"画像の読み込みに失敗しました: {image_path}")
        
        print(f"📸 画像を読み込みました: {image_path}")
        print(f"   サイズ: {image.shape[1]}x{image.shape[0]}")
        
        # 推論実行
        try:
            results = self.model.infer(image)[0]
            print("🔍 推論が完了しました")
        except Exception as e:
            print(f"❌ 推論に失敗しました: {e}")
            raise
        
        # supervision APIで結果を処理
        detections = sv.Detections.from_inference(results)
        
        # 検出結果を整理
        ingredients = []
        confidences = []
        
        if hasattr(results, 'predictions') and results.predictions:
            for pred in results.predictions:
                ingredients.append(pred.class_name)
                confidences.append(pred.confidence)
        
        return {
            'image_path': image_path,
            'ingredients_count': len(ingredients),
            'ingredients': ingredients,
            'confidences': confidences,
            'detections': detections,
            'raw_results': results
        }
    
    def annotate_image(self, image_path: str, save_path: str = None) -> str:
        """
        検出結果を画像に描画
        
        Args:
            image_path: 元画像のパス
            save_path: 保存先パス（Noneの場合は自動生成）
            
        Returns:
            注釈付き画像の保存パス
        """
        # 画像を読み込み
        image = cv2.imread(image_path)
        
        # 推論実行
        results = self.model.infer(image)[0]
        detections = sv.Detections.from_inference(results)
        
        # アノテーター作成
        bounding_box_annotator = sv.BoxAnnotator()
        label_annotator = sv.LabelAnnotator()
        
        # 注釈を追加
        annotated_image = bounding_box_annotator.annotate(
            scene=image, detections=detections
        )
        annotated_image = label_annotator.annotate(
            scene=annotated_image, detections=detections
        )
        
        # 保存パスを決定
        if save_path is None:
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            save_path = f"{base_name}_annotated.jpg"
        
        # 画像を保存
        cv2.imwrite(save_path, annotated_image)
        print(f"💾 注釈付き画像を保存しました: {save_path}")
        
        return save_path


def test_fridge_detection():
    """テスト実行関数"""
    print("=" * 60)
    print("🧪 冷蔵庫食材検出テスト開始")
    print("=" * 60)
    
    # テスト画像のパスを設定
    test_images_dir = "/Users/nguentoan/Projects/recipai/public/images/analyze_image_test"
    
    # テスト画像ディレクトリが存在しない場合は作成
    os.makedirs(test_images_dir, exist_ok=True)
    
    # 検出器を初期化
    try:
        detector = FridgeDetector()
    except Exception as e:
        print(f"❌ 検出器の初期化に失敗しました: {e}")
        return False
    
    # テスト画像を検索
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
    test_images = []
    
    for ext in image_extensions:
        for file in os.listdir(test_images_dir):
            if file.lower().endswith(ext):
                test_images.append(os.path.join(test_images_dir, file))
    
    if not test_images:
        print(f"⚠️  テスト画像が見つかりません: {test_images_dir}")
        print("テスト画像を以下のディレクトリに配置してください:")
        print(f"   {test_images_dir}")
        return False
    
    print(f"📁 {len(test_images)}個のテスト画像が見つかりました")
    
    # 各画像に対してテスト実行
    success_count = 0
    for i, image_path in enumerate(test_images, 1):
        print(f"\n--- テスト {i}/{len(test_images)} ---")
        
        try:
            # 検出実行
            result = detector.detect_ingredients(image_path)
            
            print(f"🎯 検出された食材数: {result['ingredients_count']}")
            
            if result['ingredients']:
                print("📋 検出された食材:")
                for j, (ingredient, confidence) in enumerate(
                    zip(result['ingredients'], result['confidences']), 1
                ):
                    print(f"   {j}. {ingredient} (信頼度: {confidence:.2f})")
            else:
                print("   食材が検出されませんでした")
            
            # 注釈付き画像を保存
            annotated_path = detector.annotate_image(
                image_path,
                os.path.join(test_images_dir, f"result_{i}_annotated.jpg")
            )
            
            success_count += 1
            
        except Exception as e:
            print(f"❌ テスト{i}でエラーが発生しました: {e}")
    
    print(f"\n" + "=" * 60)
    print(f"🏁 テスト完了: {success_count}/{len(test_images)} 成功")
    print("=" * 60)
    
    return success_count == len(test_images)


if __name__ == "__main__":
    # テスト実行
    success = test_fridge_detection()
    
    if success:
        print("✅ 全てのテストが成功しました！")
        sys.exit(0)
    else:
        print("❌ 一部のテストが失敗しました")
        sys.exit(1)
