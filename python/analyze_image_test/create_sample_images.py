#!/usr/bin/env python3
"""
テスト用ダミー画像作成スクリプト
実際の冷蔵庫画像がない場合のサンプル画像を生成
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def create_sample_fridge_image(save_path: str, width: int = 640, height: int = 480):
    """
    テスト用の冷蔵庫風画像を作成
    
    Args:
        save_path: 保存先パス
        width: 画像幅
        height: 画像高さ
    """
    # 白背景の画像を作成
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)
    
    # 冷蔵庫の背景色（薄いグレー）
    draw.rectangle([(0, 0), (width, height)], fill='#f0f0f0')
    
    # 棚のラインを描画
    shelf_color = '#cccccc'
    for y in range(height // 4, height, height // 4):
        draw.line([(0, y), (width, y)], fill=shelf_color, width=2)
    
    # 食材を模したオブジェクトを描画
    foods = [
        {'name': 'egg', 'pos': (100, 100), 'size': (60, 80), 'color': '#fff8dc'},
        {'name': 'milk', 'pos': (250, 80), 'size': (40, 120), 'color': '#ffffff'},
        {'name': 'tomato', 'pos': (400, 110), 'size': (70, 70), 'color': '#ff6347'},
        {'name': 'carrot', 'pos': (150, 250), 'size': (80, 25), 'color': '#ff8c00'},
        {'name': 'apple', 'pos': (350, 280), 'size': (65, 65), 'color': '#ff0000'},
        {'name': 'cheese', 'pos': (480, 320), 'size': (50, 40), 'color': '#ffd700'},
    ]
    
    for food in foods:
        x, y = food['pos']
        w, h = food['size']
        
        # 楕円で食材を表現
        draw.ellipse([(x, y), (x + w, y + h)], fill=food['color'], outline='#666666')
        
        # 影を追加
        draw.ellipse([(x + 3, y + 3), (x + w + 3, y + h + 3)], fill='#cccccc')
    
    # 画像を保存
    img.save(save_path)
    print(f"✅ サンプル画像を作成しました: {save_path}")

def create_multiple_samples():
    """複数のテスト用画像を作成"""
    test_dir = "/Users/nguentoan/Projects/recipai/public/images/analyze_image_test"
    os.makedirs(test_dir, exist_ok=True)
    
    samples = [
        {'name': 'fridge_sample_1.jpg', 'desc': '基本的な冷蔵庫画像'},
        {'name': 'fridge_sample_2.jpg', 'desc': '食材多めの冷蔵庫画像'},
        {'name': 'fridge_sample_3.jpg', 'desc': '空に近い冷蔵庫画像'},
    ]
    
    for i, sample in enumerate(samples):
        save_path = os.path.join(test_dir, sample['name'])
        
        # 各サンプルで少し違う画像を作成
        if i == 0:
            create_sample_fridge_image(save_path, 640, 480)
        elif i == 1:
            create_sample_fridge_image(save_path, 800, 600)  # 大きめ
        else:
            create_sample_fridge_image(save_path, 480, 360)  # 小さめ
        
        print(f"📸 作成: {sample['desc']}")

if __name__ == "__main__":
    print("🎨 テスト用サンプル画像を作成中...")
    create_multiple_samples()
    print("✅ 全てのサンプル画像を作成しました！")
