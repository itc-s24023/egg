# users/{uid}

## テーブル概要

Firebase Authenticationユーザーに紐付くアプリ用プロフィールを管理する。メールアドレスはプロフィール情報として保持する。パスワード、認証トークン、サービスアカウント秘密鍵はFirestoreへ保存しない。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|ドキュメントID|String|PK, NN|Firebase AuthenticationのUID|
|email|String|NN|Firebase Authenticationのメールアドレス|
|createdAt|Timestamp|NN|初回作成日時|
|updatedAt|Timestamp|NN|最終更新日時|

ユーザー情報は `users/{uid}` に保存する。認証プロバイダーとパスワードはFirebase Authenticationで管理する。
