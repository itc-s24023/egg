# Next.jsでGoogle Pickerを使用する方法

取得日: 2026-11-08

## 機能

- Google Driveのファイル選択ダイアログをWebアプリに組み込む。
- Client ComponentからPickerを開き、選択結果としてファイルID、名前、MIMEタイプ、URL等を受け取る。
- `DocsView`のMIMEタイプ指定で画像・PDF等に絞り込める。
- `MULTISELECT_ENABLED`で複数選択を有効化できる。
- 選択したファイルIDをNext.jsのRoute Handlerへ送信し、サーバー側で再検証・取得する。

## ライブラリ・フレームワーク

| 区分 | 名称 | 用途 |
|---|---|---|
| フレームワーク | Next.js App Router | Server/Client Component、Route Handler |
| UI | React | Pickerボタンと選択結果の表示 |
| Google UI | Google Picker API | Driveファイルの選択UI |
| Google認証 | Google Identity Services | OAuthアクセストークンの取得 |
| Google API | Google Drive API | 選択ファイルの権限・メタデータ・内容の再確認 |
| 任意のNode.jsクライアント | `googleapis` | サーバー側Drive API呼び出し |

## ツール・認証情報

Google Cloud Consoleで次を設定する。

1. Google Picker APIを有効化する。
2. 必要に応じてGoogle Drive APIを有効化する。
3. Web用OAuth 2.0 Client IDを作成する。
4. APIキーを作成し、HTTPリファラーと利用APIを制限する。

環境変数の分類:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: ブラウザに公開可能なOAuth Client ID。
- `NEXT_PUBLIC_GOOGLE_API_KEY`: ブラウザで使う制限済みAPIキー。
- `GOOGLE_CLIENT_SECRET`: サーバー専用。`NEXT_PUBLIC_*`にしない。
- リフレッシュトークン、サービスアカウント秘密鍵もサーバー専用にする。

## 手順

### Client ComponentでPickerを読み込む

1. ファイル先頭に`'use client'`を置く。
2. `https://apis.google.com/js/api.js`を`useEffect`内で一度だけ読み込む。
3. `gapi.load('picker', ...)`完了後にボタンを有効化する。
4. `window`、`google`、`gapi`をSSR中に参照しない。

### OAuthトークンを取得する

Google Identity ServicesのToken Clientで、用途に応じたスコープを要求する。

- `https://www.googleapis.com/auth/drive.file`: 最小権限の第一候補。
- `https://www.googleapis.com/auth/drive.readonly`: Drive全体の読み取りが必要な場合のみ。
- `https://www.googleapis.com/auth/drive`: 全体の読み書きが必要な場合のみ。

取得したアクセストークンを`PickerBuilder.setOAuthToken()`へ渡す。

### Pickerを構築する

```ts
const picker = new google.picker.PickerBuilder()
  .addView(
    new google.picker.DocsView()
      .setIncludeFolders(true)
      .setMimeTypes('image/png,image/jpeg,image/webp')
  )
  .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
  .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
  .setOAuthToken(accessToken)
  .setCallback(callback)
  .build()

picker.setVisible(true)
```

コールバックでは`PICKED`アクションだけを処理し、`docs`から必要な項目を取得する。

### サーバー側で再検証する

1. Client Componentからfile IDをRoute Handlerへ送る。
2. ログイン中ユーザーまたはアプリの認可状態を確認する。
3. Drive APIでファイルの存在、権限、削除状態、MIMEタイプを再確認する。
4. 必要なら`files.get`で内容を取得し、同一オリジンのURLから配信する。

Pickerのコールバック結果だけを信頼しない。任意のfile IDによるファイル取得を許可しない。

## 実装上の注意

- Google Pickerはブラウザ依存のため、Server ComponentではなくClient Componentに隔離する。
- `gapi.auth2`に依存する古い例より、Google Identity Servicesを使う。
- APIキーは公開前提だが、必ずドメイン・API制限を設定する。
- OAuthスコープは最小権限にする。
- 許可MIMEタイプをサーバー側でも検査する。
- 認証付きDrive URLを`next/image`へ直接渡さず、必要に応じてRoute Handlerでプロキシする。
- トークン、Client Secret、秘密鍵をログやクライアントバンドルに出さない。

## 出典

- Google Picker Web API: https://developers.google.com/workspace/drive/picker/guides/web-picker
- Google Pickerサンプル: https://developers.google.com/workspace/drive/picker/guides/web-picker-sample
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Google Identity Services: https://developers.google.com/identity/oauth2/web/guides/overview
- Google Drive API認証: https://developers.google.com/workspace/drive/api/guides/api-specific-auth
