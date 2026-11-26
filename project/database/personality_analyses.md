# users/{uid}/characters/main/analyses/{analysisId}

## テーブル概要

会話やお世話の履歴を分析した時点の性格タイプと話題傾向を保存する。キャラクター配下のサブコレクションとして保存する。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|ドキュメントID|String|PK, NN|Firestore自動生成ID|
|personalityType|String|NN|性格タイプ|
|topicSummary|Array<Map>|NN|話題傾向|
|analysisSourceCount|Number|NN|分析対象データ件数|
|createdAt|Timestamp|NN|分析日時|
