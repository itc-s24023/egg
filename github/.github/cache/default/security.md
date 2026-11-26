# セキュリティ

更新日: 2026-11-04

## 必須運用

- OWASP Top 10とSecure Coding Practicesを設計・レビューのチェックリストにする。
- 依存関係をロックし、Dependabot等で更新と脆弱性監査を自動化する。
- CIでSAST、依存関係スキャン、秘密情報検出、テストを実行する。
- 認証・認可、入力検証、出力エスケープ、CSRF/CORS、CSP、レート制限を脅威モデルに応じて実装する。
- 最小権限、秘密情報の環境分離、監査ログ、バックアップ復旧手順を整備する。
- 依存ライブラリは保守状況、公開脆弱性、ライセンス、署名・来歴を確認する。
- 可能な範囲でメモリ安全な言語を選び、低レベルコードはRust等で境界を明確にする。

## 優先順位

1. 認証・認可と秘密情報の保護
2. 外部入力とデータアクセスの検証
3. 依存関係・CI/CDサプライチェーンの保護
4. ログ、監視、インシデント対応
5. 性能最適化（必ず計測後に実施）

出典: OWASP https://owasp.org/www-project-top-ten/ 、OpenSSF https://openssf.org/ 、GitHub Dependabot https://docs.github.com/en/code-security/dependabot
