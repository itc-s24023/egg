# users

## テーブル概要

ユーザー登録・ログインに必要なアカウント情報を管理する。パスワードは平文で保存せず、ハッシュ値のみ保存する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|UUID|PK, NN|ユーザーID|
|email|VARCHAR(255)|UK, NN|ログイン用メールアドレス|
|password_hash|VARCHAR(255)|NN|ハッシュ化済みパスワード|
|created_at|TIMESTAMPTZ|NN|登録日時|
|updated_at|TIMESTAMPTZ|NN|更新日時|

