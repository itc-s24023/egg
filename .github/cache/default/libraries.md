# ライブラリ・フレームワーク

更新日: 2026-11-04

## 用途別候補

| 用途 | 第一候補 | 切り替え候補 |
|---|---|---|
| Web UI | React | SvelteKit、Astro |
| TypeScriptのWeb/API | Next.js、Fastify | Express（既存資産） |
| Python API | FastAPI | Django、Flask |
| ORM | Prisma、Drizzle | 要件に合う既存ORM |
| SQL DB | PostgreSQL | スケール・データモデル上の明確な理由がある場合のみ変更 |
| CI/CD | GitHub Actions | 組織標準のCI基盤 |

## 選定基準

- 型定義、入力スキーマ、テスト、リリース履歴、脆弱性対応の実績を確認する。
- 依存を増やす前に標準機能または既存の共通ヘルパーを再利用する。
- 本番採用前に、主要経路のベンチマークと依存ライセンスを確認する。
- ライブラリのバージョン固定、ロックファイル、定期的な更新を運用に組み込む。

出典: React https://react.dev/ 、Next.js https://nextjs.org/docs 、Fastify https://fastify.dev/docs/latest/ 、Prisma https://www.prisma.io/docs
