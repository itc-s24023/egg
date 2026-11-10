# characters

## テーブル概要

ユーザーが育成するAIキャラクターの基本情報と成長情報を管理する。1ユーザーにつき1体のキャラクターを保持する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|UUID|PK, NN|キャラクターID|
|user_id|UUID|FK(users.id), UK, NN|所有ユーザーID|
|name|VARCHAR(100)|NN|キャラクター名|
|growth_stage|VARCHAR(20)|NN|たまご、こども、せいちょう|
|experience|INTEGER|NN|経験値。0以上|
|personality_type|VARCHAR(50)| |現在の性格タイプ|
|favorite_topics|JSONB|NN|好きな話題の分析結果|
|started_at|TIMESTAMPTZ|NN|育成開始日時|
|died_at|TIMESTAMPTZ| |死亡日時。存命中はNULL|
|created_at|TIMESTAMPTZ|NN|作成日時|
|updated_at|TIMESTAMPTZ|NN|更新日時|

