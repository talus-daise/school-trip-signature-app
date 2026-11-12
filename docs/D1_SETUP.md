# D1 共有データベース セットアップ手順書

署名を localStorage だけに保存すると、その端末でしか見られません。
このアプリは **Cloudflare Pages Functions (Worker ランタイム) + D1 (SQLite)**
で共有化しています。別の Worker プロジェクトは不要です。
Pages Functions が Worker として動き、D1 に保存します。

## 構成

- `functions/api/signatures.ts`
  - `GET /api/signatures` … 署名一覧 (新しい順、最大 1000 件)
  - `POST /api/signatures` … 署名登録。学籍番号/メールアドレスの
    重複はサーバー側でチェックし、重複時は 409 を返す。
- `migrations/0001_create_signatures.sql` … 署名テーブル定義
- `src/lib/signaturesApi.ts` … フロント側の API クライアント
- `src/App.tsx` … 起動時に API から一覧を読み、登録も API 経由にする。
  API に接続できないときだけ、従来どおり localStorage にフォールバックする。
- `wrangler.toml` … プロジェクト名 `school-trip-signature-app` と
  D1 バインディング (`DB`) を定義する。

## プライバシーについて

- 学籍番号/メールアドレス (`identifier`) は重複チェックのため D1 に保存するが、
  一覧 API (`GET /api/signatures`) では返しません。
  フォームに「公開されません」と書いてあるとおりです。
- そのため、画面の CSV 出力には identifier は含まれません。
  学校提出用に identifier 付きの全件が必要な場合は、
  下の「全件エクスポート」で D1 から直接出してください。

## 本番 D1 の作成 (Cloudflare アカウントが必要)

ローカルでは仮の `database_id` で動きますが、本番では実際の D1 が必要です。
Cloudflare にログインした状態で、プロジェクトのルートで実行します。

```bash
npx wrangler login
npm run db:create
# → 出力された database_id を wrangler.toml の
#    [[d1_databases]] の database_id に書き込む
npm run db:migrate:remote
```

その後、`main` にプッシュすると Pages の GitHub 連携で自動デプロイされます。
または手動で:

```bash
npm run pages:deploy
```

## ローカル開発

```bash
npm ci
npm run db:migrate:local
npm run pages:dev
# → http://localhost:8788/ で開く。/api/signatures がローカル D1 を使う。
```

ローカル D1 のデータは `.wrangler/` に保存され、git には含まれません。

## 全件エクスポート (identifier 付き、管理者用)

```bash
npx wrangler d1 execute school-trip-signatures --remote --command \
  "SELECT id, name, role, grade, class_room, identifier, display_option, destination_idea, message, created_at FROM signatures ORDER BY created_at DESC;"
```

CSV にしたい場合は、Cloudflare ダッシュボードの D1 コンソールからも実行できます。

## デモデータについて

D1 には初期のデモ 4 件は入れていません。
本番で集める署名は 0 件から始まります。
デモ 4 件をどうしても引き継ぎたい場合は、別途教えてください。
