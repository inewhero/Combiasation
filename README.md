# Country Similarity Survey App

Vue 3 + Vite 问卷应用，当前采用 **Supabase 主链路写入 + Firebase 回退写入**。项目部署到 GitHub Pages。

## Architecture

### Submission flow
1. 前端优先写入 Supabase（PostgREST）。
2. 若 Supabase 失败（网络/超时/服务错误等）则自动回退写入 Firebase。
3. 数据中会记录：
   - `submitPrimary`
   - `submitBackend`
   - `submitFallbackUsed`

### Validation flow
1. 使用 [validation/validate_dual_source.py](validation/validate_dual_source.py) 拉取 **Supabase + Firebase**。
2. 按 UUID 合并并进行一致性检查。
3. 输出 [validation/validation_result.xlsx](validation/validation_result.xlsx)。

## Prerequisites

- Node.js >= 24
- Python 3.10+
- Firebase 项目（Firestore）
- Supabase 项目（含表 `survey_responses`）

## Environment Variables

本地使用 [ .env ](.env)（不提交），模板在 [.env.example](.env.example)。

### Firebase
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Supabase (frontend)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (兼容别名)
- `VITE_SUPABASE_TABLE` (默认 `survey_responses`)
- `VITE_SUPABASE_TIMEOUT_MS` (默认 `10000`)

### Supabase (validation only)
- `SUPABASE_SERVICE_ROLE_KEY`（建议用于校验读取）

说明：validation 在严格 RLS 下如果仅用 anon/publishable key，可能读到空数组。

## Setup

```bash
npm install
```

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Mock and QA

### Quick Firebase mock
```bash
python scripts/generate_mock_submission.py --count 1 --language zh --pair-count 8
```

### Full-flow mock (same question sampling logic as frontend)
```bash
node scripts/mock_submit_full_flow.mjs --language zh --duration 780
```

## Validation

安装依赖：
```bash
python -m pip install -r validation/requirements.txt
```

执行双源校验：
```bash
python validation/validate_dual_source.py
```

产出文件：
- [validation/validation_result.xlsx](validation/validation_result.xlsx)

## GitHub Pages Deployment

工作流文件：[.github/workflows/deploy.yml](.github/workflows/deploy.yml)

### Required GitHub Secrets
Firebase:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Supabase:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_TABLE`
- `VITE_SUPABASE_TIMEOUT_MS`

## Supabase RLS (recommended baseline)

对 `survey_responses` 开启 RLS，前端匿名仅允许 INSERT，禁止 SELECT/UPDATE/DELETE。

> validation 若要读取 Supabase，请用 `SUPABASE_SERVICE_ROLE_KEY` 在本地脚本执行，不要暴露到前端。

## Repository Hygiene Check

已确认以下内容未被误纳管：
- `node_modules/`
- `dist/`
- `validation/*.xlsx`

这类内容由 [.gitignore](.gitignore) 屏蔽。
