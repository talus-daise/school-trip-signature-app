# Cloudflare Pages デプロイ手順書

本署名アプリケーション（修学旅行復活×創立150周年記念プロジェクト）を **Cloudflare Pages** に無料かつ高速・安全にデプロイする完全ガイドです。

---

## 🚀 デプロイ方法（2つの選択肢）

Cloudflare Pages では、以下のいずれかの方法で簡単に公開できます。
初心者の方やチーム共同管理には **【方法A: GitHub連携】** が最もおすすめです。

---

### 【方法A】GitHub連携による自動デプロイ（おすすめ）

コードをGitHubにプッシュするだけで、コミットごとに自動ビルド＆公開プレビューが行われます。

1. **Cloudflare アカウントの準備**
   - [Cloudflare ダッシュボード](https://dash.cloudflare.com/) にログイン（無料アカウントでOK）。
2. **Pages プロジェクト作成**
   - 左側メニューの **「Workers & Pages」** > **「作成」 (Create application)** をクリック。
   - **「Pages」** タブを選択し、**「Git に接続」 (Connect to Git)** をクリック。
3. **リポジトリの選択**
   - 本プロジェクトの GitHub リポジトリ（例: `school-trip-petition`）を選択。
4. **ビルド設定の入力**
   - **プロジェクト名**: `school-trip-petition`（任意の名前）
   - **本番ブランチ**: `main` (または作業ブランチ)
   - **フレームワーク プリセット**: `Vite` を選択
   - **ビルド コマンド**: `npm run build`
   - **ビルド出力ディレクトリ**: `dist`
   - **Node.js バージョン（環境変数）**: 必要に応じて `NODE_VERSION` を `20` または `22` に設定
5. **「保存してデプロイ」をクリック**
   - 約1分でビルドが完了し、`https://school-trip-petition.pages.dev` のような公開URLが発行されます。

---

### 【方法B】Wrangler CLI による直接デプロイ（手動・コマンド一発）

ターミナルから直接アップロードしたい場合の手順です。本プロジェクトには既に `wrangler` が設定されています。

1. **Cloudflare にログイン**
   ```bash
   npx wrangler login
   ```
   ブラウザが開き、承認を求められるので「許可」します。

2. **ビルド＆デプロイを実行**
   ```bash
   npm run pages:deploy
   ```
   初回実行時はプロジェクト名（デフォルト: `school-trip-petition`）を確認されます。
   デプロイが完了すると即座に公開URLが表示されます。

---

## 🔒 学校向けおすすめセキュリティ＆プライバシー設定

### 1. 独自ドメインの設定（カスタムドメイン）
- 学校の独自ドメイン（例: `petition.example-hs.ed.jp` や独自の記念サイトドメイン）をお持ちの場合、Pages の **「カスタム ドメイン」** タブから数クリックでSSL証明書付きで割り当てられます。

### 2. 生徒・保護者・関係者限定アクセス（Cloudflare Access / Zero Trust）
署名を「学校関係者のみ」に限定して集めたい場合、Cloudflare の無料枠（最大50ユーザー無料）で提供される **Cloudflare Zero Trust (Access)** を活用できます。
- Pages プロジェクト設定 > **「Access ポリシーの管理」**
- 「学校のGoogle Workspaceアカウント（@school.ed.jp）」や「ワンタイム暗証番号（One-time PIN）」による認証を有効化できます。

---

## 📁 本プロジェクトに含まれる Cloudflare 用設定ファイル

1. `wrangler.toml`: Cloudflare Pages のプロジェクト定義および出力ディレクトリ指定 (`dist`)
2. `public/_redirects`: SPA用の全URLルーティング書き換え (`/* /index.html 200`)
3. `public/_headers`: セキュリティヘッダー（クリックジャッキング防止、MIMEスニッフィング抑止）および静的アセットの1年キャッシュ設定

---

## 🛠️ トラブルシューティング

- **ビルドエラーが発生する場合**:
  Cloudflare Pages の設定画面で「環境変数」に `NODE_VERSION = 20` を追加してください。
- **データのリセットや確認**:
  署名データはブラウザの `localStorage` に安全に保管されます。管理者は右上の「管理・集計出力」モーダルからいつでも全件CSVダウンロードおよび学校・知道会提出用文書の生成が可能です。
