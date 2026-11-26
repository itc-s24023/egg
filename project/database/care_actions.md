# users/{uid}/characters/main/careActions/{actionId}

## テーブル概要

ごはん、遊ぶ、寝かせるなどのお世話の実行履歴と、実行による変化量を管理する。キャラクター配下のサブコレクションとして保存する。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|ドキュメントID|String|PK, NN|Firestore自動生成ID|
|actionType|String|NN|feed、play、sleepなど|
|experienceDelta|Number|NN|増加した経験値|
|hungerDelta|Number|NN|おなかの変化量|
|energyDelta|Number|NN|元気の変化量|
|friendshipDelta|Number|NN|なかよし度の変化量|
|createdAt|Timestamp|NN|実行日時|
