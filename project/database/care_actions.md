# care_actions

## テーブル概要

ごはん、遊ぶ、寝かせるなどのお世話の実行履歴と、実行による変化量を管理する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|BIGSERIAL|PK, AI, NN|行動履歴ID|
|character_id|UUID|FK(characters.id), NN|キャラクターID|
|action_type|VARCHAR(30)|NN|feed、play、sleepなど|
|experience_delta|INTEGER|NN|増加した経験値|
|hunger_delta|INTEGER|NN|おなかの変化量|
|energy_delta|INTEGER|NN|元気の変化量|
|friendship_delta|INTEGER|NN|なかよし度の変化量|
|created_at|TIMESTAMPTZ|NN|実行日時|

