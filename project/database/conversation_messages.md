# users/{uid}/characters/main/messages/{messageId}

## テーブル概要

ユーザーとAIキャラクターの会話を1メッセージ単位で保存し、会話履歴表示とキャラクター分析に利用する。キャラクター配下のサブコレクションとして保存する。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|ドキュメントID|String|PK, NN|Firestore自動生成ID|
|role|String|NN|userまたはassistant|
|content|String|NN|メッセージ本文|
|createdAt|Timestamp|NN|送信日時|
