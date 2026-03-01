# Backend Architecture Review (Learn2Master)

## High-level architecture

- **Runtime**: Flask monolith with SQLAlchemy and raw SQL (`server/app.py`).
- **Auth model**: Dual-mode identity (legacy local auth + Supabase JWT shadow users).
- **Data plane**: PostgreSQL/Supabase in production, SQLite fallback for local (`DATABASE_URL` default).
- **AI layer**: `AIService` abstraction supports OpenAI/Gemini/Anthropic, plus RAG over Supabase vectors.

## What is working well

1. **Pragmatic product velocity**
   - Single service keeps operational complexity low for early-stage iteration.
   - Endpoint surface already covers auth, LMS basics (schools/classes/assignments), learner telemetry, and AI adaptation.

2. **Reasonable SQL hygiene in most paths**
   - Most database calls use parameterized SQL via `text(...)`, which limits injection risk.

3. **Useful local-first fallback behavior**
   - AI calls degrade to deterministic helper responses when provider calls fail.
   - Local SQLite bootstrap path simplifies development setup.

4. **Good feature foundation for adaptive learning**
   - Learner profiling + pathway generation + mastery updates form a coherent adaptive loop.

## Critical engineering risks (ordered by production impact)

### 1) Authentication context mismatch can break authorization logic

`require_auth` passes a **dict** (`user_data`) into handlers. Several handlers still treat that arg as plain `lin` string and run queries like:

```sql
SELECT role FROM users WHERE lin=:lin
```

This occurs in school/class/assignment handlers that accept `auth_lin`.

**Impact**:
- Admin/role checks may silently fail.
- Access control can become inconsistent across endpoints.

**Recommendation**:
- Standardize the decorator contract: always pass a typed auth context object (`user_id`, `lin`, `role`).
- Introduce centralized helper `get_local_user(auth_ctx)` and use local numeric `users.id` for relational checks.

### 2) Async route usage is inconsistent with Flask runtime model

There is a mix of:
- sync routes manually creating event loops (`ai_chat`), and
- `async def` route handlers.

This can lead to subtle loop/runtime issues and uneven throughput characteristics under WSGI servers.

**Recommendation**:
- Pick one model:
  - either fully sync Flask handlers + background queue for long AI calls, or
  - migrate to an ASGI-native stack for async-heavy endpoints.
- Avoid creating/destroying event loops per request.

### 3) Role/permission enforcement is fragmented and ad hoc

Authorization rules are embedded directly in endpoints, with repeated SQL role checks.

**Impact**:
- Hard to audit.
- Easy to introduce privilege regressions.

**Recommendation**:
- Introduce policy decorators (`@require_role('admin')`, `@require_any_role(...)`).
- Build and enforce an endpoint-role matrix.

### 4) PII and secret leakage risk in error responses/logging

Several endpoints return raw exception text directly to clients.

**Impact**:
- Potential leakage of internals/SQL details.

**Recommendation**:
- Return stable, sanitized API errors to clients.
- Log full exception details server-side with request correlation IDs.

### 5) Data consistency and identity model drift

Current model mixes:
- `users.id` (int PK),
- `users.lin` (legacy identity),
- Supabase `sub` UUID persisted into `lin` for shadow users.

**Impact**:
- FK/reference confusion and migration complexity.

**Recommendation**:
- Introduce explicit `external_auth_id` (UUID) and keep `lin` domain-specific.
- Standardize internal joins on numeric `users.id`.

### 6) Migration execution path is fragile

`/api/v1/system/migrate` splits SQL by semicolons and executes statement by statement.

**Impact**:
- Breaks on procedural SQL/functions.
- No transactional rollback envelope around full migration.

**Recommendation**:
- Move to formal migration tooling (Alembic) with versioned migrations.
- Disable migration endpoint in production runtime.

## Performance and scalability observations

1. **No pagination on collection endpoints**
   - `schools`, `classes`, `assignments`, `notes`, `bookmarks`, etc. can grow without bounded query size.

2. **Potentially expensive AI/RAG request latency path**
   - AI and PDF processing are inline request/response operations.

3. **Indexing is decent but incomplete for emerging access paths**
   - Core indexes exist, but additional composite indexes may be needed as traffic grows.

4. **`SELECT MAX(id)` for last insert IDs**
   - Used in multiple create endpoints; unsafe under concurrency.
   - Prefer `INSERT ... RETURNING id` (Postgres).

## Security hardening opportunities

1. **Rate limiting** for auth and AI endpoints.
2. **Request size limits** (especially upload endpoints).
3. **Content scanning / extension + MIME validation** for uploaded files.
4. **Audit logging** for privileged actions (school creation/deletion, migration).
5. **Token verification defense-in-depth** (issuer checks, stronger claims validation where possible).

## API design / maintainability gaps

1. **No explicit schema validation layer**
   - Request payload validation is mostly manual and inconsistent.

2. **Large `app.py` (god file)**
   - Difficult to reason about ownership and testing.

3. **Mixed naming semantics** (`lin`, `user_id`, `id`, `tmis`) across handlers.

4. **No versioned error envelope contract**
   - Response shape for errors is inconsistent.

## Suggested refactor roadmap

### Phase 1 (stabilize, 1–2 weeks)
- Normalize auth context usage in all protected handlers.
- Replace `SELECT MAX(id)` with `RETURNING id`.
- Add centralized error handler + sanitized error responses.
- Add pagination parameters to list endpoints.

### Phase 2 (security + observability, 2–3 weeks)
- Role policy decorators and endpoint-role matrix tests.
- Request validation (e.g., Pydantic/Marshmallow).
- Structured logging + request IDs + audit log table.
- Rate limiting on sensitive routes.

### Phase 3 (architecture evolution, 3–6 weeks)
- Split service into modules/blueprints (`auth`, `school`, `lms`, `ai`, `rag`).
- Introduce migration tooling (Alembic) and remove runtime migration endpoint.
- Decide async strategy (WSGI+queue vs ASGI-native).

## Minimum quality gates to add immediately

1. Unit tests for auth decorator behavior and role checks.
2. Integration tests for all create endpoints under concurrent inserts.
3. Contract tests for API error envelope.
4. Smoke tests for AI endpoint fallback behavior when provider keys are absent.

## Final assessment

The backend is **feature-rich for a pilot**, with strong domain intent and rapid-delivery pragmatism. The main risk is not missing features; it is **consistency under scale and security hardening**. If the team executes Phase 1 + 2 quickly, this codebase can become a robust production-grade education backend without full replatforming.
