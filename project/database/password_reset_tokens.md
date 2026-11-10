# password_reset_tokens

## テーブル概要

パスワード再設定メールに含める一時トークンを管理する。トークンはハッシュ化して保存し、有効期限と使用済み状態を確認する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|UUID|PK, NN|トークンID|
|user_id|UUID|FK(users.id), NN|対象ユーザーID|
|token_hash|VARCHAR(255)|UK, NN|ハッシュ化済みトークン|
|expires_at|TIMESTAMPTZ|NN|有効期限|
|used_at|TIMESTAMPTZ| |使用日時。未使用はNULL|
|created_at|TIMESTAMPTZ|NN|発行日時|

