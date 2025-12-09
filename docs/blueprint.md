# Learn2Master — System Blueprint

This document contains the complete engineering blueprint for Learn2Master: an offline-capable, AI-powered adaptive A-Level e-learning platform aligned to Uganda's NCDC CBC.

## 1. System Vision
- Purpose: Deliver personalized learning aligned to NCDC CBC competencies, for low-bandwidth and offline environments.
- Impact: Increase mastery, reduce teacher workload, enable data-driven curriculum adjustments.
- Users: Learners, Teachers, School Admins, NCDC Curriculum Team, Content Authors, System Administrators.

## 2. Feature Specification (Summary)
- Learner features: onboarding, baseline assessment, adaptive learning path, quizzes, hints, remediation, offline mode, progress visuals.
- Teacher features: class roster, quick marking, competency heatmaps, AI suggestions, offline grading.
- Admin: school analytics, device management, content distribution.
- NCDC tools: mapping canvas, versioning, release workflow.
- AI components: learner profiling, simplified knowledge tracing, recommendation engine, error classification, rubric evaluator, explainability.

See `docs/full_feature_spec.md` for an expanded list (generated from design notes).

## 3. Data Models
- Use Postgres (jsonb) for server. Key tables: Users, Schools, Classes, Competencies, Indicators, ContentItems, Assessments, Questions, Attempts, MasteryRecords, OfflineBundles, SyncLogs, Devices, ActivityLogs, ModelMeta.
- Local device: IndexedDB (web) schema mirrors minimal server entities: users, content_items, attempt_queue, mastery_local, sync_metadata.

ER Diagram: (conceptual)
- User 1..* Attempts
- Content *..* Competency
- Competency 1..* Indicator
- Attempt -> Assessment -> ContentItem

## 4. AI Engine Design
- Learner profiling: aggregate baseline + attempts + engagement -> profile vector.
- Mastery estimator: Bayesian/ BKT-style per competency (p in [0,1]).
- Recommendation: multi-objective scoring + bandit exploration bonus.
- Feedback generator: rule-based + light NLP for short answer similarity.
- Rubric evaluator: rules + ML heuristics for projects; queue manual grading when needed.

Pseudocode and component interfaces available in `docs/ai_design.md`.

## 5. System Architecture
- Client: React + PWA, IndexedDB for offline, Service Worker for background sync.
- Server: Python Flask (prototype) or Django REST Framework for production; AI microservice separated.
- Storage: Postgres + S3 for media; Redis for cache and Celery broker.
- Background: Celery workers for grading, bundle generation, retraining.

Offline flow: client downloads bundles, works offline, queues attempts, syncs on connectivity.

## 6. API (summary)
- Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- Sync: `POST /api/v1/sync/upload`, `GET /api/v1/sync/changes?since=`
- Content: `GET /api/v1/content`, `GET /api/v1/content/{id}`
- Recommendations: `GET /api/v1/recommendations/{lin}`

Full OpenAPI file at `specs/api.yaml`.

## 7. UI & UX
- Mobile-first PWA with responsive dashboards: learner home, lesson view, quiz, project submission, teacher quick mark, authoring canvas.
- Accessibility: WCAG AA, captions, alt-text, keyboard navigation.

## 8. Offline Strategy
- Local DB schema (IndexedDB) mirror, queue pattern, batch sync, conflict-resolve rules (timestamp/teacher override), bundle manifest (.l2mpak) with signed manifest.

## 9. Authoring Tool
- Competency mapping canvas, WYSIWYG lesson builder, question builder, rubric templates, versioning, export `.l2mpak` bundles.

## 10. Monitoring & Admin
- Prometheus/Grafana for metrics, ELK for logs, admin sync health dashboard, model performance views.

## 11. Security
- TLS, server-side hashing, JWTs, RBAC, audit trails, consent & data export features.

## 12. Deployment
- Docker images, Helm charts for K8s, CI pipeline (GitHub Actions), backups, scaling via replicas, caching using Redis.

## 13. Implementation Roadmap
- Phase 1: Scaffolding, PWA, offline queue, basic AI stub, import pipeline.
- Phase 2: Replace prototype auth with server JWT, expand sync to persist attempts, implement BKT and recommendation service.
- Phase 3: Authoring tool, model retraining pipelines, pilot deployments.

---
This blueprint is the canonical source for developer and stakeholder handoff. Contact the engineering lead to schedule the pilot and content ingestion tasks.
