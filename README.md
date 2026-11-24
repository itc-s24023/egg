# AIごっち

企画書・要件定義・データベース設計に基づく Next.js + TypeScript + Prisma の実装です。

## 起動

1. `cp .env.example .env` を実行し、`DATABASE_URL` と `SESSION_SECRET` を設定します。
2. PostgreSQL を起動し、`npm install`、`npm run prisma:migrate` を実行します。
3. `npm run dev` で開発サーバーを起動します。

`NVIDIA_API_KEY` を設定すると、サーバー側からNVIDIA NIMのOpenAI互換API（既定モデル：`nvidia/nemotron-3.5-bolt-e4b`）を利用します。必要に応じて `NVIDIA_API_BASE_URL` と `NVIDIA_MODEL` で接続先・モデルを変更できます。APIキーはブラウザへ公開されません。未設定時は開発環境では開発用の応答を返し、本番環境では設定エラーとして扱います。

NVIDIA APIでHTTP 410が返る場合は、APIキーの有効性だけでなく、NVIDIA API CatalogでPublic API Endpointsの利用権限が有効か確認してください。

## Firebase

Firebase Web SDKは `src/lib/firebase.ts` で初期化します。`.env` にFirebase ConsoleのWebアプリ設定を `NEXT_PUBLIC_FIREBASE_*` という名前で追加してください。これらの値はブラウザで使う公開設定ですが、`.env` はGitへコミットしないでください。

`firestore` をクライアントコンポーネントからimportするとFirestoreを利用できます。Analyticsは `getFirebaseAnalytics()` をブラウザ上で呼び出してください。Firebaseを使う場合でも、現在のキャラクターAPIと認証データはPrisma/PostgreSQLを利用します。

## 実装済み

- メールアドレス・パスワードによる登録、ログイン、ログアウト
- キャラクターの成長段階、経験値、満腹度、元気、なかよし度
- 会話内容に応じて変化する明るさ、論理、ユーモア、丁寧さの4つの性格パラメーター表示
- ごはん、遊ぶ、寝かせると履歴保存を伴うステータス更新
- Gemini API を利用したチャットと会話履歴保存
- じゃんけんの結果・育成反映保存
- Prisma による PostgreSQL スキーマ