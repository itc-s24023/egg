# conversation_messages

## テーブル概要

ユーザーとAIキャラクターの会話を1メッセージ単位で保存し、会話履歴表示とキャラクター分析に利用する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|BIGSERIAL|PK, AI, NN|メッセージID|
|character_id|UUID|FK(characters.id), NN|キャラクターID|
|role|VARCHAR(20)|NN|userまたはassistant|
|content|TEXT|NN|メッセージ本文|
|created_at|TIMESTAMPTZ|NN|送信日時|

