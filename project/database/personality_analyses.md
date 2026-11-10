# personality_analyses

## テーブル概要

会話やお世話の履歴を分析した時点の性格タイプと話題傾向を保存する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|BIGSERIAL|PK, AI, NN|分析結果ID|
|character_id|UUID|FK(characters.id), NN|キャラクターID|
|personality_type|VARCHAR(50)|NN|性格タイプ|
|topic_summary|JSONB|NN|話題傾向|
|analysis_source_count|INTEGER|NN|分析対象データ件数|
|created_at|TIMESTAMPTZ|NN|分析日時|

