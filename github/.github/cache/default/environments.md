# 開発環境・実行基盤

更新日: 2026-11-04

## 推奨デフォルト

- フロントエンド: React 19 + TypeScript。SSRやフルスタック要件があればNext.js 16を候補にする。
- Node.js API: Fastifyを標準候補にし、スキーマ駆動の入力検証を使う。Expressは既存資産を優先する場合に採用する。
- Python API: FastAPI。AI/データ処理との統合とリクエスト検証を重視する場合に適する。
- データベース: PostgreSQLをリレーショナルデータの第一候補にする。
- 再現可能な実行環境: Docker。
- CI/CD: GitHub Actions等でテスト、型検査、依存関係監査を自動化する。
- Kubernetesは複数サービス、複雑なスケーリング、運用体制が必要になってから導入する。

## 性能判断

- 一般的なWebアプリは、まずアプリケーション境界、DBクエリ、キャッシュ、観測可能性を計測する。
- 高スループット・低レイテンシAPIはGoまたはRustを候補にする。
- PythonはAI/MLやデータ処理の生産性を優先し、重い処理は非同期化または専用サービスへ分離する。
- 不要に複雑なインフラを先行導入せず、測定結果に基づいて拡張する。

出典: Node.js https://nodejs.org/en/docs/ 、FastAPI https://fastapi.tiangolo.com/ 、Docker https://docs.docker.com/ 、PostgreSQL https://www.postgresql.org/docs/
