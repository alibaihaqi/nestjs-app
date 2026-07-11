# Changelog

All notable changes to this project will be documented in this file.

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
