# mini_game_results

## テーブル概要

じゃんけん、〇✕ゲーム、オセロ、五目並べの対戦結果を管理する。

## カラム定義

|カラム名|データ型|制約|備考|
|---|---|---|---|
|id|BIGSERIAL|PK, AI, NN|対戦結果ID|
|character_id|UUID|FK(characters.id), NN|キャラクターID|
|game_type|VARCHAR(30)|NN|rock_paper_scissors、tic_tac_toe、othello、gomoku|
|result|VARCHAR(20)|NN|win、lose、draw|
|experience_delta|INTEGER|NN|増加した経験値|
|friendship_delta|INTEGER|NN|増加したなかよし度|
|created_at|TIMESTAMPTZ|NN|対戦終了日時|

