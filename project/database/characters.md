# users/{uid}/characters/main

## テーブル概要

ユーザーが育成するAIキャラクターの基本情報、成長情報、現在のステータスを管理する。1ユーザーにつき `main` ドキュメントを1つ保持する。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|ドキュメントID|String|PK, NN|固定値 `main`|
|name|String|NN|キャラクター名|
|growthStage|String|NN|たまご、こども、せいちょう|
|experience|Number|NN|経験値。0以上|
|personalityType|String / null| |現在の性格タイプ|
|favoriteTopics|Array<Map>|NN|好きな話題の分析結果|
|startedAt|Timestamp|NN|育成開始日時|
|diedAt|Timestamp / null| |死亡日時。存命中はnull|
|status|Map|NN|満腹度、元気、なかよし度、性格パラメーター|
|createdAt|Timestamp|NN|作成日時|
|updatedAt|Timestamp|NN|更新日時|
