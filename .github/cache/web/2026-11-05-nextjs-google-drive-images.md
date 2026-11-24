# Next.js + Google Drive画像選択・表示

取得日: 2026-11-05

## 推奨構成

Google Driveを画像カタログとして使い、Next.jsのサーバー側でDrive APIを呼び出す。ブラウザにはDriveのアクセストークンを渡さず、次の2つのRoute Handlerを同一オリジンで提供する。

1. `GET /api/drive/images`: `files.list`で画像のメタデータを一覧取得する。
2. `GET /api/drive/images/[fileId]`: `files.get`に`alt=media`を付け、認証済みの画像バイナリをストリームして返す。

クライアントの選択UIは一覧APIの`id`、`name`、`mimeType`、`thumbnailLink`等を表示し、選択後の`src`には`/api/drive/images/{fileId}`を使う。これにより、認証が必要なDrive URLを`next/image`の外部取得に任せず、サーバー側で認可・Content-Type・サイズ制限を適用できる。

## Google Drive API

- 画像一覧は`files.list`を使い、例として`mimeType contains 'image/' and trashed = false`、必要なら特定フォルダの`'{folderId}' in parents`で絞り込む。
- `fields`で`files(id,name,mimeType,size,modifiedTime,thumbnailLink,capabilities/canDownload),nextPageToken`のように必要な項目だけ返す。ページングと`pageSize`を使い、全件取得を避ける。
- 画像本体はBlobファイルなので、`files.get({fileId, alt: 'media'})`で取得する。取得前に`capabilities.canDownload`を確認する。
- Google Workspace文書は画像Blobとは別物で、`files.export`等が必要。画像選択機能では`image/*`を許可し、文書MIMEタイプを除外する。
- ユーザー自身のDriveを選ばせる場合はOAuth 2.0を使う。アプリが開いた・共有されたファイルだけでよい場合は、可能な限り狭い`drive.file`スコープを優先する。全Drive参照の`drive.readonly`や`drive`は必要性がある場合だけにする。
- 固定された共有フォルダをアプリが管理する場合は、サーバー専用のサービスアカウント等を検討する。ただし対象フォルダを明示的に共有し、秘密鍵をクライアントへ出さない。

## Next.js実装

- `app/api/drive/images/route.ts`に一覧用`GET`、`app/api/drive/images/[fileId]/route.ts`に画像用`GET`を置く。
- DriveクライアントとOAuth/サービスアカウント処理はサーバー専用モジュールに隔離する。`GOOGLE_CLIENT_SECRET`、リフレッシュトークン、サービスアカウント秘密鍵を`NEXT_PUBLIC_*`に置かない。
- `next/image`の既定画像最適化は外部画像取得時に認証ヘッダーを転送しない。認証付き画像は同一オリジンのプロキシURLを`src`にし、プロキシ側で認証する。公開URLを直接使う場合だけ`remotePatterns`を狭く設定し、`unoptimized`の採用可否を測定して決める。
- Route Handlerは既定ではキャッシュされない。一覧はユーザー・権限単位で短時間キャッシュを検討し、画像本体は`Cache-Control`、ETag、`max-age`等を要件に合わせて設定する。ユーザー固有データを共有キャッシュしない。
- 画像表示には実際の縦横比に応じた`width`/`height`または`fill`と`sizes`を指定し、`alt`は画像の意味を表す。大量一覧では遅延読み込み、サムネイル、ページングを使う。

## 速度・容量

- 一覧APIではメタデータのみ取得し、`fields`、ページング、フォルダ/MIME絞り込みでレスポンスを小さくする。
- 選択画面は`thumbnailLink`を使える場合にプレビューとして利用し、最終表示またはダウンロードは認可済みプロキシ経由にする。認証やURLの有効性を保証したい場合は、サムネイルもサーバー側で中継する。
- 大きな原画像を一覧で取得しない。画像の最大バイト数、許可MIMEタイプ、タイムアウト、レート制限をRoute Handlerで設定する。
- `googleapis` Node.jsクライアントを使う場合は、型付きのDrive API呼び出しとストリーミングを利用し、独自のHTTP認証実装を増やさない。

## 型安全・入力検証

- `fileId`、ページトークン、フォルダIDをURL/クエリから受け取る境界で検証する。Drive APIの返却値も信頼せず、`id`、`name`、`mimeType`、`size`等を実行時スキーマで検証してからUIへ渡す。
- `mimeType`は許可リスト（例: `image/jpeg`、`image/png`、`image/webp`）で検査し、レスポンスの`Content-Type`をDrive値の無検証コピーにしない。
- TypeScriptの`strict`を有効にし、APIレスポンス型とUIの画像項目型を分ける。エラー時は適切なHTTPステータスと明示的なエラーJSONを返し、空配列などの成功形に偽装しない。

## セキュリティ

- クライアントから受け取った`fileId`だけで任意のDriveファイルを返さない。ログイン中ユーザーまたはアプリが許可したフォルダ・ファイルかをサーバー側で再確認する。
- OAuthスコープ、Drive共有設定、Next.jsの認証認可を分離して考え、最小権限とテナント境界を守る。ファイル名をHTMLへ挿入する場合はエスケープする。
- 画像プロキシはSSRF防止のため、任意URLを受け取らず、Drive APIのファイルIDだけを受け付ける。レスポンスサイズ、レート、同時実行数を制限する。
- `Content-Disposition`、`X-Content-Type-Options: nosniff`、適切なCSPを設定し、トークン・秘密鍵・Driveの機密URLをログに出さない。
- `canDownload`がfalseのファイルや、削除済み・許可外MIMEタイプのファイルは明示的に拒否する。

## 代替: Google Picker

「ユーザーが自分のDriveから選ぶ」ことが主目的なら、Google Pickerをクライアントの選択UIとして使い、返されたファイルIDをNext.jsサーバーへ渡す構成も候補になる。ただしPickerの認証・許可と、サーバー側でのファイルID再検証は別途必要であり、Pickerの結果をそのまま信頼しない。

## 出典

- Next.js Image Component: https://nextjs.org/docs/app/api-reference/components/image
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Google Drive APIでファイルを検索: https://developers.google.com/workspace/drive/api/guides/search-files
- Google Drive APIでファイルをダウンロード: https://developers.google.com/workspace/drive/api/guides/manage-downloads
- Google Drive APIの認証・認可: https://developers.google.com/workspace/drive/api/guides/api-specific-auth
- Google APIs Node.js client: https://github.com/googleapis/google-api-nodejs-client
