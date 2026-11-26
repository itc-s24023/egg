# users/{uid}/characters/main/miniGameResults/{resultId}

## テーブル概要

じゃんけん、〇✕ゲーム、オセロ、五目並べの対戦結果を管理する。キャラクター配下のサブコレクションとして保存する。

## フィールド定義

|フィールド名|Firestore型|制約|備考|
|---|---|---|---|
|ドキュメントID|String|PK, NN|Firestore自動生成ID|
|gameType|String|NN|rock_paper_scissors、tic_tac_toe、othello、gomoku|
|result|String|NN|win、lose、draw|
|experienceDelta|Number|NN|増加した経験値|
|friendshipDelta|Number|NN|増加したなかよし度|
|createdAt|Timestamp|NN|対戦終了日時|
