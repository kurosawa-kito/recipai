# 🔍 冷蔵庫食材検出システム (Analyze Image Test)

このディレクトリには、Roboflow fridgevision/3 モデルを使用した冷蔵庫内食材の自動検出システムが含まれています。

## 📋 概要

- **目的**: 冷蔵庫の写真から食材を自動検出
- **AI モデル**: YOLOv8 fridgevision/3 (Roboflow提供)
- **言語**: Python 3.9+
- **主要機能**:
  - 冷蔵庫画像の食材検出
  - 検出結果の可視化
  - 注釈付き画像の生成

## 🚀 クイックスタート

### 1. 必要な環境

- Python 3.9以上
- インターネット接続 (AIモデルのダウンロード用)

### 2. 自動セットアップ & 実行

```bash
# このディレクトリに移動
cd python/analyze_image_test

# 自動実行スクリプトを実行（初回は依存関係を自動インストール）
./run_test.sh
```

### 3. 手動セットアップ (オプション)

```bash
# 仮想環境作成
python3 -m venv venv
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt

# テスト実行
python test_fridge_detection.py
```

## 📸 テスト画像の準備

以下のディレクトリにテスト用の冷蔵庫画像を配置してください：

```
public/images/analyze_image_test/
```

**サポートされる形式**: `.jpg`, `.jpeg`, `.png`, `.bmp`

## � 実行結果

テスト実行後、以下が生成されます：

1. **コンソール出力**

   ```
   🎯 検出された食材数: 1
   📋 検出された食材:
      1. apple (信頼度: 0.61)
   ```

2. **注釈付き画像**
   - 元画像に検出結果を重ねた画像
   - 保存先: `public/images/analyze_image_test/result_X_annotated.jpg`

## 🛠️ 技術詳細

### 使用ライブラリ

- `roboflow`: モデル管理
- `inference`: AI推論実行
- `supervision`: 検出結果可視化
- `opencv-python`: 画像処理
- `numpy`: 数値計算

### AIモデル情報

- **モデル ID**: `fridgevision/3`
- **提供者**: Roboflow
- **タイプ**: 物体検出 (YOLOv8ベース)
- **特化分野**: 冷蔵庫内食材

## �📁 ファイル構成

```
analyze_image_test/
├── test_fridge_detection.py  # メインテストコード
├── requirements.txt          # Python依存関係
├── run_test.sh              # 自動実行スクリプト
├── create_sample_images.py  # サンプル画像生成ツール
├── README.md                # このファイル
└── venv/                    # 仮想環境（自動生成）
```

## 🔧 カスタマイズ

### API キーの変更

```python
# test_fridge_detection.py の38行目付近
detector = FridgeDetector(api_key="your_api_key_here")
```

### 検出しきい値の調整

モデルの信頼度しきい値を調整したい場合は、`test_fridge_detection.py`内で設定できます。

## 🐛 トラブルシューティング

### よくある問題

1. **ライブラリインストールエラー**

   ```bash
   # pipをアップグレード
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

2. **画像読み込みエラー**
   - 画像ファイルが破損していないか確認
   - サポートされる形式か確認

3. **API エラー**
   - インターネット接続を確認
   - API キーが正しいか確認

4. **macOS Apple Silicon での問題**
   ```bash
   # Rosetta 2経由でインストール
   arch -x86_64 pip install -r requirements.txt
   ```

### ログの確認

詳細なエラー情報は実行時のコンソール出力を確認してください。

## 📝 ライセンス & 利用規約

- Roboflow APIの利用規約に従ってください
- 商用利用の場合は、Roboflowの商用ライセンスが必要な場合があります

## 🔗 関連リンク

- [Roboflow Documentation](https://docs.roboflow.com/)
- [Supervision Library](https://supervision.roboflow.com/)
- [OpenCV Documentation](https://docs.opencv.org/)

---

## 💡 RECIPAIプロジェクトでの活用

このシステムは、RECIPAIプロジェクトの以下の機能で活用できます：

1. **食材自動認識**: アップロードされた冷蔵庫画像から食材リストを自動生成
2. **レシピ提案**: 検出された食材を基にしたレシピ推薦
3. **在庫管理**: 冷蔵庫内の食材を定期的にチェック

### Next.js統合例

```typescript
// pages/api/analyze-fridge.ts
import { exec } from "child_process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imagePath = req.body.imagePath;

  // Pythonスクリプト実行
  exec(
    `cd python/analyze_image_test && python test_fridge_detection.py ${imagePath}`,
    (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      // 結果をパース
      const ingredients = parseDetectionResults(stdout);
      res.status(200).json({ ingredients });
    }
  );
}
```
