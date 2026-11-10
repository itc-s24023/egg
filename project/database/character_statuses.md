# character_statuses

## テーブル概要

キャラクターの現在の満腹度、元気、なかよし度を管理する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|character_id|UUID|PK, FK(characters.id), NN|キャラクターID|
|hunger|INTEGER|NN|おなかの状態|
|energy|INTEGER|NN|元気の状態|
|friendship|INTEGER|NN|なかよし度|
|updated_at|TIMESTAMPTZ|NN|最終更新日時|

