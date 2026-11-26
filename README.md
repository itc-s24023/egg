# AIごっち

Firebase AuthenticationとCloud Firestoreを使う Next.js + TypeScript アプリです。

## 起動

1. Firebase ConsoleでAuthenticationのメール/パスワードとGoogleプロバイダーを有効にし、Cloud Firestoreを作成します。
2. `cp .env.example .env` を実行し、Firebase Webアプリ設定と `FIREBASE_PROJECT_ID` を設定します。
3. Firebase Admin SDKサービスアカウントJSONを安全な場所に保存し、`.env` の `GOOGLE_APPLICATION_CREDENTIALS` にそのファイルパスを設定します。JSONをGitへコミットしたり、`NEXT_PUBLIC_` 変数に設定したりしないでください。ファイルパスを使えないホスティング環境では、`FIREBASE_CLIENT_EMAIL` と `FIREBASE_PRIVATE_KEY` にサービスアカウントの値をサーバー専用環境変数として設定します。
4. `npm install` と `npm run dev` を実行します。

`NVIDIA_API_KEY` を設定すると、サーバー側からNVIDIA NIMのOpenAI互換API（既定モデル：`nvidia/nemotron-3.5-bolt-e4b`）を利用します。必要に応じて `NVIDIA_API_BASE_URL` と `NVIDIA_MODEL` で接続先・モデルを変更できます。APIキーはブラウザへ公開されません。未設定時は開発環境では開発用の応答を返し、本番環境では設定エラーとして扱います。

NVIDIA APIでHTTP 410が返る場合は、APIキーの有効性だけでなく、NVIDIA API CatalogでPublic API Endpointsの利用権限が有効か確認してください。

## Firebase

Firebase Web SDKは `src/lib/firebase.ts` で初期化し、メール/パスワードとGoogle認証に利用します。`.env` にFirebase ConsoleのWebアプリ設定を `NEXT_PUBLIC_FIREBASE_*` という名前で追加してください。これらの設定はブラウザーで使います。

サーバー側はFirebase Admin SDKでIDトークンを検証し、セッションCookieを発行してCloud Firestoreへユーザー、キャラクター、会話、お世話、ゲーム、分析データを保存します。Admin SDK資格情報はサーバー専用です。既存のPostgreSQLデータは自動移行しません。

Firebase Analyticsは `getFirebaseAnalytics()` をブラウザー上で呼び出してください。

## 実装済み

- Firebase Authenticationによるメール/パスワード・Google登録、ログイン、ログアウト
- キャラクターの成長段階、経験値、満腹度、元気、なかよし度
- 会話内容に応じて変化する明るさ、論理、ユーモア、丁寧さの4つの性格パラメーター表示
- ごはん、遊ぶ、寝かせると履歴保存を伴うステータス更新
- Gemini API を利用したチャットと会話履歴保存
- じゃんけんの結果・育成反映保存
- Cloud Firestoreによるユーザー別データ保存