# データベース設計書

本システムではFirebase Authenticationでユーザーを認証し、Cloud Firestoreにアプリデータを保存する。FirestoreのユーザーUIDをデータのルートとし、育成状態と履歴をユーザーごとのサブコレクションに分ける。パスワードはFirebase Authenticationのみで管理し、Firestoreには保存しない。

|コレクション／ドキュメント|概要|
|---|---|
|`users/{uid}`|Firebase Authenticationユーザーのプロフィール|
|`users/{uid}/characters/main`|キャラクター情報と現在のステータス|
|`users/{uid}/characters/main/messages`|会話履歴|
|`users/{uid}/characters/main/careActions`|お世話履歴|
|`users/{uid}/characters/main/miniGameResults`|ゲーム結果|
|`users/{uid}/characters/main/analyses`|性格・話題分析履歴|

## リレーション概要

- Firebase AuthenticationのUIDを `users/{uid}` のドキュメントIDとして使用する。
- `users/{uid}` にキャラクター `characters/main` を1件持つ。
- キャラクターの状態は `characters/main` の `status` マップに保持する。
- 会話、お世話、ゲーム、分析の履歴はキャラクター配下のサブコレクションに保存する。
- Firebase Admin SDKはサーバー側でのみ利用する。既存PostgreSQLデータは自動移行しない。
