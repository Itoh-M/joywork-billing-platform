# JoyWork Billing Platform (MVP)

Next.js + TypeScript + PostgreSQL + Prisma + Tailwind CSS で構築した請求書作成Webアプリです。

## 機能
- 顧客管理（CRUD）
- 単価管理（CRUD、更新時は新規レコード作成）
- 請求書作成（明細複数行）
- 金額自動計算（小計/税/合計）
- 請求書PDF生成・ダウンロード

## 主要ルール
- 請求書番号: `JW-YYYYMM-連番`（3桁ゼロ埋め）
- 請求月: `YYYYMM`
- 税率: 10%
- 消費税小数: 切り捨て
- `invoice_items.amount = quantity * unit_price`
- `invoices.subtotal = invoice_items.amount 合計`
- `invoices.tax_amount = floor(subtotal * 0.10)`
- `invoices.total_amount = subtotal + tax_amount`

## セットアップ
1. 依存関係
```bash
npm install
```
2. PostgreSQL起動（Docker）
```bash
docker compose up -d
```
3. 環境変数
```bash
copy .env.example .env
```
4. DBマイグレーション
```bash
npm run prisma:generate
npm run prisma:migrate
```
5. Seed投入
```bash
npm run prisma:seed
```
6. 起動
```bash
npm run dev
```

## 画面
- `/dashboard`
- `/customers`
- `/customers/new`
- `/customers/[id]/edit`
- `/unit-prices`
- `/unit-prices/new`
- `/unit-prices/[id]/edit`
- `/invoices`
- `/invoices/new`
- `/invoices/[id]`
- `/invoices/[id]/pdf`

## API
- `GET/POST /api/v1/customers`
- `GET/PUT/DELETE /api/v1/customers/[id]`
- `GET/POST /api/v1/unit-prices`
- `GET/PUT/DELETE /api/v1/unit-prices/[id]`
- `GET/POST /api/v1/invoices`
- `GET/PUT/DELETE /api/v1/invoices/[id]`
- `POST /api/v1/invoices/[id]/confirm`
- `POST /api/v1/invoices/[id]/issue`
- `POST /api/v1/invoices/[id]/cancel`
- `POST /api/v1/invoices/[id]/generate-pdf`
- `GET /api/v1/invoices/[id]/pdf`

