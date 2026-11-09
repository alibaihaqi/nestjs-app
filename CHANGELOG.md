# Changelog

All notable changes to this project will be documented in this file.

## 2026-11-09 — chore: bump Node 26.4.0 -> 26.12.1

### Changed
- `.node-version` (and any hardcoded CI `node-version`) bumped 26.4.0 -> 26.12.1 for upstream Node security fixes.

## [Unreleased] — 2026-08-23 (stage 4)
### Changed
- openai 4.18 → 7.5 (zero source changes — the chat/audio/image surface used is stable across the v4→v7 line); @aws-sdk/client-s3, pm2 5 → 7, ulidx, class-validator 0.15
- @google/generative-ai 0.3 (deprecated) → @google/genai 2.18 — `gemini` module rewritten: `new GoogleGenAI({apiKey})`, `models.generateContent({model, contents})`, stream chunks expose `.text` as a property. Public service signatures and `gemini.controller.ts` unchanged
- zod 3 → 4 — `.nonempty(msg)` → `.min(1, msg)` (4 occurrences in `src/openai/dto/openai.dto.ts`); `ZodValidationPipe` unchanged and still returns 400 with issue detail

### Note
- `@google/genai` has no `GenerateContentStreamResult` type (the plan assumed one). `models.generateContentStream` resolves to `AsyncGenerator<GenerateContentResponse>`, so `GeminiChatGetMessageData` unions that instead, and `getChatResponse` narrows with an `asyncIterator` guard. Sync `POST /gemini/chat` with `stream:true` now returns `result: null` explicitly (previously `undefined` via a `.response` field the old SDK exposed)

## [Unreleased] — 2026-08-23
### Chore
- Prisma 5.8 → 7.9: prisma.config.ts (datasource url moved out of schema — P1012), prisma-client generator (output src/generated/prisma), @prisma/adapter-pg driver adapter; nest build excludes prisma.config.ts (rootDir fix); all 9 migrations verified on scratch Postgres
- NestJS 10 → 11.2, fastify 4 → 5.12, @nestjs/config 4, @nestjs/event-emitter 3, @nestjs/axios 4, reflect-metadata 0.2.2, @types/node 26
- Pinned Node 26.4.0 via `.node-version` (fleet standard, matches flagsphere/learning-docs)
- Added `engines.node >=26.0.0` and `packageManager: pnpm@10.11.0` to `package.json`
- Added `.github/workflows/ci.yml` — fleet-standard CI (checkout@v7, pnpm/action-setup@v6 from `packageManager`, setup-node@v7 via `node-version-file` + pnpm cache; install → prisma:generate → lint → test → build)

### Fixed
- Repaired 3 stub suites (`aws.service.spec.ts`, `openai.service.spec.ts`, `openai.controller.spec.ts`) — missing DI providers wired with minimal stubs (`ConfigService` `{ get: () => 'test' }`, `EventEmitter2` real instance, controller-level service stubs); assertions untouched. Test baseline lifted from 3F/4P to 0F/7P — all later upgrade-stage gates require 7/7 suites passing

## [Unreleased] — 2026-08-22
### Chore
- Replaced ESLint 8 (+ @typescript-eslint, prettier plugins) with oxlint 1.79 — `keyv` no longer in lockfile
- TypeScript 5.1 → 5.9.3, jest 29 → 30.4, ts-jest 29.4, prettier 3.9

## [Unreleased] - 2026-07-26

### Added
- `ARCHITECTURE.md` — narrative-first system reference: module/dependency tables, topology + auth model, Mermaid sequence diagrams for OpenAI chat (sync + SSE), TTS, transcription, and WebRTC signaling relay, full Prisma schema catalog, complete API reference (19 endpoints across 6 modules), consumer/client flow docs (no frontend in this repo — documents expected external WebSocket gateway + chat UI integration), endpoint-to-consumer reverse map, and a consolidated gotchas section.

## [0.2.0] - 2026-07-11

### Added
- Added to ali-pa monorepo as submodule
- Created CLAUDE.md with full project documentation

## [Unreleased]

### Added
- Google Gemini chat integration (PR #1) — streaming + non-streaming endpoints
- WebRTC signaling module — connect/disconnect, room CRUD, connection init/signal
- Prisma ORM with PostgreSQL — rtc_socket_user and rtc_socket_room models
- IP geolocation via apiip.com
- Math benchmark module (loop vs multiplication)
- Zod validation pipes for all DTOs
- ULID-based request tracing via LoggerMiddleware

### Changed
- Migrated from Express to Fastify adapter
- Refactored SSE streaming to use EventEmitter2 pattern
- Updated Prisma schema with room/user relations

### Fixed
- Fixed SSE subscription complete handler

## [0.1.0] - 2024-02

### Added
- OpenAI chat completions (non-streaming)
- OpenAI SSE streaming chat
- Text-to-audio (TTS) with S3 upload
- Audio transcription from S3-stored files
- Image generation via OpenAI
- AWS S3 module for asset storage/retrieval
- Common health check endpoint
- Math module for benchmarking
- Jest unit + e2e test setup
- PM2 production process management
