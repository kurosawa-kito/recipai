# RECIPAI

冷蔵庫の写真からAIがレシピを提案するサービスです。

## 開発環境セットアップ手順

1. このリポジトリをクローン

   ```bash
   git clone https://github.com/kurosawa-kito/recipai.git
   cd recipai
   ```

2. 依存パッケージのインストール

   ```bash
   yarn install
   # または npm install
   ```

3. `.env` ファイルの作成
   - `.env.example` をコピーして `.env` を作成し、各種APIキーやDB接続情報を記入してください。

   ```bash
   cp .env.example .env
   # 必要に応じて値を編集
   ```

4. Prismaマイグレーション（DB初期化）

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. 開発サーバー起動
   ```bash
   yarn dev
   # または npm run dev
   ```

   - ブラウザで http://localhost:3000 を開いて動作確認

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
