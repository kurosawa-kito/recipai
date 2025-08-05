# RECIPAI

冷蔵庫の写真からAIがレシピを提案するサービスです。

## 開発環境セットアップ手順

### 1. リポジトリのクローン

```
git clone https://github.com/kurosawa-kito/recipai.git
cd recipai
```

### 2. Node.js（Next.js）環境構築

- Node.js（v18以上）をインストール
  - [公式ダウンロードページ](https://nodejs.org/ja/download/) からインストーラーを取得し、インストールしてください。
  - インストール後、ターミナルで `node -v` と `npm -v` でバージョン確認。
  - もし `npm` コマンドが使えない場合は、Node.jsのインストールが正しく完了していない可能性があります。再インストールやパス設定を確認してください。
- 依存パッケージをインストール

```
npm install
```

- `.env` ファイルを作成し、DB接続情報やAPIキーを記載

### 3. Prisma（DB）セットアップ

- NeonDB/PostgreSQLのDBを用意
- `.env` の `DATABASE_URL` を設定
- Prismaマイグレーション

```
npx prisma migrate dev
npx prisma generate
```

### 4. Next.js サーバー起動

```
npm run dev
```

- ブラウザで `http://localhost:3000` にアクセス

### 5. Python（FastAPI）環境構築

- Python（3.9以上）をインストール
- 仮想環境を作成・アクティベート

```
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate   # Windows
```

- 必要パッケージをインストール

```
pip install fastapi uvicorn
```

- FastAPIサーバー起動

```
cd python
uvicorn analyze_image:app --reload
```

- Swagger UI: `http://localhost:8000/docs`

### 6. APIテスト方法

- Swagger UIで `/analyze` エンドポイントをテスト（複数画像ファイルをアップロード可能）
- curl例:

```
curl -X POST "http://localhost:8000/analyze" \
  -F "files=@画像1.jpg" \
  -F "files=@画像2.jpg"
```

### 7. AI食材検出システム（オプション）

冷蔵庫の画像から食材を自動検出するPythonベースのシステムが利用可能です。

```bash
# 食材検出システムのディレクトリに移動
cd python/analyze_image_test

# 自動セットアップ & 実行
./run_test.sh
```

詳細な使用方法は [`python/analyze_image_test/README.md`](python/analyze_image_test/README.md) を参照してください。

**特徴:**

- YOLOv8ベースのAIモデル（fridgevision/3）
- リアルタイム食材検出
- 検出結果の可視化
- Next.jsとの統合可能

### 8. よくあるトラブル

- `.env` の設定漏れ
- DB接続エラー
- Python仮想環境のアクティベート忘れ
- パッケージ未インストール

### 9. 参考資料

- `PROJECT_OVERVIEW.md`（全体構成）
- `RECIPE_FLOW.md`（画面・API連携の流れ）

---

不明点はGitHub IssueやSlackで質問してください。

## git運用ルール

- 開発者は必ず新しいブランチを切って作業してください。
  - 例: `feature/xxxx`, `fix/xxxx`
- 作業が終わったらGitHub上でプルリクエスト（Pull Request, PR）を作成してください。
- PRは必ずレビュワー（管理者）が内容を確認し、問題なければマージします。
- mainブランチへ直接pushは禁止です。
- コミットメッセージは簡潔かつ内容が分かるように記載してください。

## その他

- DBやAPIキーなどの機密情報は `.env` ファイルで管理し、gitにはコミットしないでください。
- 質問や相談はGitHubのIssueまたはSlack等で行ってください。

---

運用・管理: kurosawa-kito
