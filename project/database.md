# データベース設計書

本システムではPostgreSQLを使用し、ユーザーごとの認証情報、AIキャラクターの育成状態、会話履歴、世話・ゲームの行動履歴を永続化する。ユーザーを基点に各データを関連付け、ユーザー間で育成情報や会話履歴が混在しない構成とする。

|テーブル名|テーブル概要|
|---|---|
|users|ユーザーの認証情報を管理する|
|characters|ユーザーが育成するAIキャラクターを管理する|
|character_statuses|キャラクターの現在のステータスを管理する|
|conversation_messages|ユーザーとAIキャラクターの会話履歴を管理する|
|care_actions|ごはん、遊ぶ、寝かせるなどのお世話履歴を管理する|
|personality_analyses|性格・話題分析の結果を管理する|
|mini_game_results|ミニゲームの対戦結果を管理する|
|password_reset_tokens|パスワード再設定用トークンを管理する|

## リレーション概要

- `users` 1 : 1 `characters`
- `characters` 1 : 1 `character_statuses`
- `characters` 1 : 多 `conversation_messages`
- `characters` 1 : 多 `care_actions`
- `characters` 1 : 多 `personality_analyses`
- `characters` 1 : 多 `mini_game_results`
- `users` 1 : 多 `password_reset_tokens`

