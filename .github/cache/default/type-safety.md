# 型安全・品質保証

更新日: 2026-11-04

- 新規WebコードはJavaScriptよりTypeScriptを優先し、`strict`を有効化する。
- Pythonは型ヒントを公開API、データモデル、主要な境界に付与し、mypy等の静的検査をCIで実行する。
- APIでは静的型だけに依存せず、実行時スキーマ検証（Fastify schema、Pydantic等）を行う。
- Go、Rust、Java、C#はコンパイル時型検査を活用し、エラーを明示的に扱う。
- 型検査、単体テスト、統合テスト、リンターをCIの品質ゲートにする。
- 外部入力、JSON、環境変数、DB結果は信頼せず、境界で検証して内部型へ変換する。

出典: TypeScript https://www.typescriptlang.org/tsconfig/strict.html 、mypy https://mypy.readthedocs.io/ 、Pydantic https://docs.pydantic.dev/
