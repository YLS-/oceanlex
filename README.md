# 辞書・例文検索 Webアプリ

## 概要
異なる技術選択を前提に、Next.js を軸にした Web アプリと SQL データモデリングの
実装力を磨き込む小規模プロジェクト。

## 目標
- NestJS（BFF）と PostgreSQL／Drizzle ORM による型安全 REST API を設計・実装し、実行時データバリデーションを導入
- 辞書・多言語例文データを ETL（Firestore→SQL正規化・索引化）
- フロントエンド：React／Next.js による辞書検索 UI を実装し、Meilisearch高速検索での連携（＊未実装）

## 技術スタック
- Node.js／TypeScript
- React／Next.js
- NestJS（BFF）
- PostgreSQL／Drizzle ORM
- Meilisearch（予定）
- Firestore（ETL ソース）
- Turborepo／pnpm

## アーキテクチャ概要
Web（Next.js）→ BFF（NestJS）→ DB（PostgreSQL）の構成を基本に、ETL で
Firestore のドキュメントデータを SQL に正規化して取り込みます。検索は
Meilisearch 連携を想定（未実装）しています。

## データソース / ETL
語彙および多言語例文データは、別プロジェクト「Odyssee」で Firestore に
蓄積していたドキュメント形式データを利用しています。ETL により正規化・
索引化して SQL へ移行する設計です。

## デプロイ想定
- PostgreSQL：Neon
- NestJS（BFF）：Fly.io
- React／Next.js：Vercel
- Meilisearch：別途 Fly.io での運用を想定（未実装）

## 今後の予定
- Meilisearch 連携の実装と検索体験の最適化
- UI/UX 改善（検索結果の並び替え、絞り込みなど）
- API と ETL のテスト拡充

## セットアップ
前提：`pnpm` と `Docker` が利用できる環境。

```sh
pnpm install
pnpm db:up
```

## 実行
```sh
pnpm dev
```

その他：
- `pnpm db:down`：DB 停止
- `pnpm db:studio`：Drizzle Studio 起動
- `pnpm build` / `pnpm lint`

## リポジトリ構成
```
apps/          # アプリケーション
  api/         # NestJS BFF（REST API）
  web/         # Next.js フロントエンド
libs/          # 共有ライブラリ（DB/モデル/transport など）
scripts/etl/   # ETL スクリプト
docker-compose.yml
turbo.json
```
