# characters/main.status

## テーブル概要

キャラクターの現在の満腹度、元気、なかよし度、性格パラメーターを管理する。`users/{uid}/characters/main` ドキュメント内のMapフィールドとして保存する。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|hunger|Number|NN|おなかの状態|
|energy|Number|NN|元気の状態|
|friendship|Number|NN|なかよし度|
|brightness|Number|NN|明るさ|
|logic|Number|NN|論理|
|humor|Number|NN|ユーモア|
|politeness|Number|NN|丁寧さ|
|updatedAt|Timestamp|NN|最終更新日時|
