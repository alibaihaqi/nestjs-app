# NestJS App

NestJS backend API for AI integrations (OpenAI, Gemini), WebRTC signaling, and AWS S3 asset management.

## Tech Stack

- **Runtime:** Node.js + NestJS 10 (Fastify adapter)
- **Language:** TypeScript 5.1+ (CommonJS, relaxed strictness — `strictNullChecks: false`)
- **Database:** PostgreSQL via Prisma 5.8
- **AI:** OpenAI v4.18, Google Generative AI v0.3
- **Cloud:** AWS S3 v3.451
- **Validation:** Zod (primary), custom `ZodValidationPipe`
- **Streaming:** `@nestjs/event-emitter` for SSE
- **Package manager:** pnpm

## Commands

```bash
pnpm install
pnpm prisma:generate          # generate Prisma client
pnpm prisma:migrate:dev       # apply dev migrations
pnpm start:dev                # dev server with watch
pnpm build && pnpm start:backend  # production
pnpm pm2:start:prod           # production via PM2
pnpm test                     # unit tests (Jest)
pnpm test:e2e                 # e2e tests
pnpm lint                     # ESLint + auto-fix
pnpm format                   # Prettier
```

## Project Structure

```
src/
  main.ts                 # Bootstrap (Fastify, CORS, global ValidationPipe)
  app.module.ts           # Root module — imports all, applies LoggerMiddleware
  middleware/             # LoggerMiddleware (ULID traceId header)
  utils/                  # ZodValidationPipe, ULID helper
  prisma/                 # @Global PrismaModule + PrismaService
  common/                 # Health check (GET /common)
  openai/                 # Chat, SSE streaming, TTS, transcription, image gen
  gemini/                 # Gemini chat + SSE streaming
  aws/                    # @Global S3 upload/download service
  rtc/                    # WebRTC signaling (rooms, users, signal relay)
  apiip/                  # IP geolocation lookup
  math/                   # Benchmark module
prisma/
  schema.prisma           # 2 models: rtc_socket_user, rtc_socket_room
  migrations/             # 9 migration files
```

## Module → Route Mapping

| Module | Prefix | Endpoints |
|--------|--------|-----------|
| Common | `/common` | `GET` health check |
| OpenAI | `/openai` | `POST /chat`, `SSE /chat-streams`, `SSE /sse`, `POST /text-to-audio`, `POST /transcriptions-from-cloud`, `POST /image-generation` |
| Gemini | `/gemini` | `POST /chat`, `SSE /stream` |
| RTC | `/rtc` | `POST /connect`, `/client-id`, `/disconnect`, `/create-room`, `/check-room`, `/join-room`, `/connection-init`, `/connection-signal` |
| ApiIP | `/apiip` | `GET /check?ip=...` |
| Math | `/math` | `POST /sum-loop`, `/sum-multiplication` |

## Conventions

- **Feature folders:** `src/<feature>/` with `<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`, `dto/`, `interfaces/`
- **Global modules:** `PrismaModule` and `AwsModule` — no import needed in consuming modules
- **Validation:** Zod schemas in `dto/`, applied via `@UsePipes(new ZodValidationPipe(schema))`
- **Interfaces:** `I`-prefix (`IChatRequest`) or module-name prefix (`GeminiChatRequest`), barrel-exported from `interfaces/index.ts`
- **DTOs:** Zod schemas exported as `const`, barrel-exported from `dto/index.ts`
- **File naming:** kebab-case (`openai.controller.ts`)
- **Class naming:** PascalCase with module prefix (`OpenaiService`)
- **Prisma models:** snake_case (`rtc_socket_user`) with `@map`
- **Error pattern:** Services return `{ success: boolean, errorMessage? }` result objects
- **Streaming:** Services emit `'message'` events via EventEmitter2; SSE endpoints subscribe via RxJS Observable

## Environment

Required (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NESTAPP_PORT` | Server port |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_API_MODEL` | Chat model name |
| `OPENAI_API_AUDIO_MODEL` | TTS model name |
| `OPENAI_API_IMAGE_MODEL` | Image model name |
| `OPENAI_API_TRANSCRIPTIONS_MODEL` | Transcription model name |
| `OPENAI_API_TRANSCRIPTIONS_LOCAL_PATH` | Temp path for audio files |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_CHAT_MODEL` | Gemini model name |
| `AWS_ACCESS_KEY_ID` | S3 access key |
| `AWS_ACCESS_KEY_SECRET` | S3 secret key |
| `AWS_BUCKET_NAME` | S3 bucket |
| `AWS_BUCKET_REGION` | S3 region |
| `AWS_OPENAI_PATH` | S3 prefix for OpenAI assets |
| `CLOUD_CDN_URL` | CDN URL prefix |
| `APIIP_CHECK_URL` | apiip.com endpoint |
| `APIIP_KEY` | apiip.com key |

## Database

PostgreSQL with Prisma. Two models:
- `rtc_socket_user` — WebRTC users (UUID PK, connectionId unique, optional room FK)
- `rtc_socket_room` — WebRTC rooms (UUID PK, roomName, isActive soft-delete)

## Gotchas

- No auth on any endpoint
- CORS is wide open (`app.enableCors()` with no config)
- Tests are stubs — `toBeDefined()` only, no real assertions
- `ulid.ts` generates one ULID at import time and reuses it (likely a bug for file naming)
- `package.json` name is `nest-be` (directory name diverged)
