# Google Picker画像管理アプリ実装準備

取得日: 2026-11-08

## 機能

- 一般ユーザーがGoogleアカウントでログインする。
- Google DriveからGoogle PickerでPNG、JPEG、WebP画像を選択する。
- 選択したGoogle Drive file IDをサーバーへ送信する。
- サーバー側でDrive APIの存在、権限、削除状態、MIMEタイプを再検証する。
- 画像レコードをユーザー単位で保存・一覧表示・詳細表示・削除する。
- アプリ内の画像コンテンツURLをDBへ保存し、認証付き同一オリジンプロキシで配信する。
- Google Drive上の元ファイルはアプリ内削除では削除しない。
- 他ユーザーの画像にはアクセスできない。

## 採用ライブラリ・技術

- Next.js App Router
- React
- TypeScript
- PostgreSQL
- Prisma
- Auth.js + Google Provider
- `@auth/prisma-adapter`
- Google Picker API
- Google Identity Services
- Google Drive API
- `googleapis`
- `zod`
- Vitest（テスト）

## 認証・トークン方針

- Auth.jsのGoogle ProviderでGoogle OAuth Authorization Codeフローを実装する。
- `@auth/prisma-adapter`によるDBセッションを使用する。
- Auth.jsはアプリログインとサーバー側Drive API認証の主体とする。
- Google Identity ServicesはPicker表示専用の短期アクセストークン取得に使う。
- Picker用アクセストークンは保存APIへ送信しない。
- PickerのGoogle subjectとAuth.jsの`accounts.provider_account_id`を照合し、不一致なら保存を拒否する。
- Google OAuth refresh tokenはサーバー側で暗号化して保存する。
- `GOOGLE_CLIENT_SECRET`、`DATABASE_URL`、`AUTH_SECRET`、`TOKEN_ENCRYPTION_KEY`をクライアントへ公開しない。

## データベース

PostgreSQL + Prismaを使用する。

Auth.js標準テーブル:

- `users`
- `accounts`
- `sessions`
- `verification_tokens`

アプリ固有テーブル:

- `images`

`images`の主要項目:

- `id`: アプリ側でINSERT前に生成するUUID
- `user_id`: `users.id`への外部キー
- `google_drive_file_id`
- `file_name`
- `mime_type`
- `file_url`: `/api/images/{id}/content`形式
- `thumbnail_url`: MVPではNULL
- `created_at`
- `updated_at`

一意制約:

- `MK(user_id, google_drive_file_id)`
- Auth.js `accounts`は`MK(provider, provider_account_id)`

## API・ルート

- `GET /api/images`: ログインユーザーの画像一覧
- `POST /api/images`: file IDを再検証して画像情報を保存
- `GET /api/images/[id]`: 所有画像の詳細
- `DELETE /api/images/[id]`: DBレコードのみ削除
- `GET /api/images/[id]/content`: Drive画像を認証付きでストリーミング配信

コンテンツAPIの要件:

- セッション・所有者・Drive権限を確認する。
- 許可MIMEタイプは`image/png`、`image/jpeg`、`image/webp`。
- 最大ファイルサイズは10MB。
- Google APIタイムアウトは10秒。
- `Cache-Control: private, no-store`。
- `X-Content-Type-Options: nosniff`。
- 任意URLを受け取らず、SSRFを防止する。
- Google由来の任意レスポンスヘッダーを転送しない。

## 非機能基準

- 一覧・詳細・削除API: p95 500ms以内（Google Drive APIを呼ばない場合）。
- 画像保存API: p95 2秒以内（外部障害時を除く）。
- 保存APIレート制限: 認証済みユーザーあたり1分30リクエスト。
- コンテンツAPIレート制限: 認証済みユーザーあたり1分120リクエスト。
- PostgreSQL日次バックアップ。
- RPO 24時間、RTO 24時間。
- 対応ブラウザ: Chrome、Edge、Safariの各最新版。

## プロジェクト初期化

作成先:

```text
/home/s24004/Desktop/ken_skills/google-picker-app
```

初期化済み:

- Next.js App Router
- TypeScript
- ESLint
- npm
- Tailwindなし
- Import alias `@/*`

初期化確認:

```bash
npm run build
```

初期ビルドは成功済み。初期依存関係監査ではmoderate脆弱性が8件検出された。

## 依存関係の初期化コマンド

```bash
cd /home/s24004/Desktop/ken_skills/google-picker-app

npm install next-auth @auth/prisma-adapter @prisma/client googleapis zod
npm install -D prisma vitest
npx prisma init --datasource-provider postgresql
```

前回のインストールは中断され、確認時点では追加ライブラリは未導入だった。

## 関連ドキュメント

- 企画書: `/home/s24004/Desktop/ken_skills/project/proposal.md`
- 要件定義: `/home/s24004/Desktop/ken_skills/project/requirements.md`
- DB設計: `/home/s24004/Desktop/ken_skills/project/database.md`
- システム設計: `/home/s24004/Desktop/ken_skills/project/system-design.md`
- 画像API詳細設計: `/home/s24004/Desktop/ken_skills/project/system-design/image-content-api.md`
- レビュー: `/home/s24004/Desktop/ken_skills/project/review.md`

## 外部情報の出典

- Auth.js Prisma Adapter: https://authjs.dev/getting-started/adapters/prisma
- Prisma init: https://www.prisma.io/docs/cli/init
- Google Picker Web API: https://developers.google.com/workspace/drive/picker/guides/web-picker
- Google Pickerサンプル: https://developers.google.com/workspace/drive/picker/guides/web-picker-sample
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
