# Excellere — AI Leadership Credential System
## Technical & Product Documentation

---

# PART I: PRODUCT DOCUMENTATION

## 1. Executive Summary

**Excellere** is an AI-powered executive education platform that delivers personalized learning assessments for senior business leaders. Unlike traditional certificate programs, Excellere provides credentials that are:

- **Personalized** — Each learner's assessment is uniquely generated based on their actual responses and thinking patterns
- **Validated** — Expert-reviewed credentials signed by renowned faculty (Harvard, ESCP)
- **Shareable** — Public credential pages suitable for CVs and LinkedIn
- **Permanent** — Permanent URLs that never expire

---

## 2. The Problem

### 2.1 Executive Education Challenges

Traditional executive education programs suffer from:

| Problem | Impact |
|---------|--------|
| Generic assessments | Certificates don't reflect actual capability |
| No personalisation | Same content for every learner |
| Unverifiable credentials | Easy to fake completion |
| No differentiation | Can't stand out on LinkedIn |
| Disconnected from career | Certificates don't translate to opportunities |

### 2.2 The Solution

Excellere combines:
1. **AI-powered assessment** — Claude generates personalized reports
2. **Human validation** — Expert faculty sign off on credentials
3. **Public verification** — Shareable credential pages
4. **Capability statements** — CV-ready paragraphs

---

## 3. User Personas & Journeys

### 3.1 The Learner (Senior Executive)

**Profile:** C-suite, VP, or senior director
**Goals:** AI fluency, career advancement, network

**Journey:**
```
1. Sign up → Complete profile (role, sector, organisation)
   ↓
2. Enroll in AI Leadership Programme (3 modules)
   ↓
3. Complete sessions → Submit artefacts
   ↓
4. AI generates "Insight Report" (auto-triggered)
   ↓
5. Expert validator reviews & signs
   ↓
6. Receive public credential URL
   ↓
7. Share on LinkedIn/CV
```

### 3.2 The Validator (Faculty Expert)

**Profile:** Professor, industry expert
**Goals:** Quality assurance, reputation

**Journey:**
```
1. Login to validator dashboard
   ↓
2. View queue of pending reports
   ↓
3. Select report to review
   ↓
4. Read learner context + AI assessment
   ↓
5. Write personal 2-4 sentence comment
   ↓
6. Sign & Issue credential
   ↓
7. Learner notified automatically
```

### 3.3 The Admin

**Profile:** Excellere operations team
**Goals:** Oversight, analytics

**Journey:**
```
1. Access admin dashboard
   ↓
2. View all learners, reports, credentials
   ↓
3. Manage validators
   ↓
4. Monitor analytics
   ↓
5. Configure modules
```

---

## 4. Product Features

### 4.1 Insight Reports

Auto-generated after each module completion:

- **Executive Summary** — Headline + body
- **What You Mastered** — Concepts with evidence
- **Where You're Building** — Gaps with actions
- **Thinking Evolution** — Arc across sessions
- **Artefact Assessment** — Board readiness score
- **What Aria Noticed** — ✦ Key differentiator
- **Capability Snapshot** — Demonstrated capabilities
- **Next Module Recommendation** — Personalized path
- **Overall Score** — 0-100

### 4.2 The "What Aria Noticed" Section

This is the product's key differentiator. Written by Claude:

- References specific learner responses
- Identifies unique thinking patterns
- Feels like a human coach observed them
- Creates "uncanny" personal connection
- Becomes shareable proof of AI fluency

### 4.3 Expert Validation

Three validators:
- **Prof. Mark Esposito** — Harvard/Hult
- **Prof. Terence Tse** — ESCP Business School
- **Danny Goh** — Excellere

Each validation includes:
- Personal 2-4 sentence comment (mandatory, human-written)
- Score override option
- Assessment status (validated/needs revision/exceptional)

### 4.4 Public Credentials

Shareable URLs: `excellere.ai/c/[slug]`

Features:
- Verified badge
- Archetype display
- What Aria Noticed
- Score visualization
- Validator signature
- QR verification code

### 4.5 Full Programme Credential

After completing all 3 modules:
- All module scores
- All badges earned
- Capability statement (CV-ready paragraph)
- Multiple validator signatures
- LinkedIn share + PDF download

---

## 5. The Three Programme Modules

### Module 1: AI-Native Business Design
- Understanding AI-native thinking
- AI maturity matrix
- Building AI-first processes

### Module 2: Agentic AI for Business
- Understanding AI agents
- Agent architecture patterns
- Multi-agent orchestration

### Module 3: Double Loop Strategy
- First vs second-order thinking
- The Double Loop Framework
- AI as strategy catalyst

---

## 6. Thinking Archetypes

Based on cognitive dimensions:

| Archetype | Description |
|-----------|-------------|
| Strategic Reframer | Questions the premise before answering |
| Pragmatic Implementer | Focuses on deployment, not theory |
| Catalyst Leader | Finds opportunity in constraints |
| Visionary Architect | Thinks in systems and structures |
| Bridge Builder | Translates complexity for others |

---

# PART II: TECHNICAL DOCUMENTATION

## 7. System Architecture

### 7.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (React) |
| Styling | CSS-in-JS (inline styles) |
| Deployment | Vercel |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| Auth | JWT + Supabase Auth |
| PDF | Puppeteer (@sparticuz/chromium) |
| Email | Google Workspace (gog CLI) |

### 7.2 Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐
│   User Browser  │────▶│   Next.js App   │
│   (React)       │◀────│   (Vercel)      │
└─────────────────┘     └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
     ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
     │   Auth API    │  │  Reports API  │  │  Validate API │
     │  /api/auth    │  │ /api/reports  │  │  /api/validate│
     └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
             │                  │                  │
             ▼                  ▼                  ▼
     ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
     │  Supabase    │  │    Claude    │  │  Supabase    │
     │  (Database)  │  │    (AI)       │  │  (Storage)   │
     └───────────────┘  └───────────────┘  └───────────────┘
```

---

## 8. Database Schema

### 8.1 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('learner', 'validator', 'admin')),
  
  -- Learner fields
  organisation TEXT,
  sector TEXT,
  job_title TEXT,
  
  -- Validator fields
  title TEXT,
  institution TEXT,
  bio TEXT,
  photo_url TEXT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.2 Learner Profiles (Cognitive Dimensions)
```sql
CREATE TABLE learner_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  -- Cognitive dimensions (0-100)
  strategic_vs_operational INTEGER DEFAULT 50,
  conceptual_vs_technical INTEGER DEFAULT 50,
  single_vs_double_loop INTEGER DEFAULT 50,
  challenge_vs_confirmation INTEGER DEFAULT 50,
  
  archetype TEXT,
  archetype_description TEXT
);
```

### 8.3 Modules
```sql
CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

### 8.4 Learner Progress
```sql
CREATE TABLE learner_modules (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_id TEXT REFERENCES modules(id),
  
  status TEXT DEFAULT 'not_started',
  progress_percent INTEGER DEFAULT 0,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, module_id)
);
```

### 8.5 Sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_id TEXT,
  session_number INTEGER NOT NULL,
  
  topic TEXT NOT NULL,
  teach_back_response TEXT,
  ai_analysis JSONB,
  
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
);
```

### 8.6 Artefacts
```sql
CREATE TABLE artefacts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_id TEXT,
  
  title TEXT NOT NULL,
  content JSONB,
  type TEXT,
  status TEXT DEFAULT 'draft',
  
  strength_scores JSONB,
  board_readiness INTEGER
);
```

### 8.7 Insight Reports (Core)
```sql
CREATE TABLE insight_reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_id TEXT NOT NULL,
  
  -- Claude-generated content
  report_content JSONB NOT NULL,
  
  -- Scores
  overall_score INTEGER,
  mastery_percentage INTEGER,
  
  -- Badges
  badges_earned JSONB DEFAULT '[]',
  
  -- Sharing
  share_slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.8 Validators
```sql
CREATE TABLE validators (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true
);
```

### 8.9 Validation Queue
```sql
CREATE TABLE validation_queue (
  id UUID PRIMARY KEY,
  report_id UUID REFERENCES insight_reports(id),
  validator_id UUID REFERENCES validators(id),
  
  status TEXT DEFAULT 'queued',
  validator_comment TEXT, -- Required, human-written
  score_override INTEGER,
  assessment TEXT,
  
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

### 8.10 Credentials (Full Programme)
```sql
CREATE TABLE credentials (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  credential_slug TEXT UNIQUE NOT NULL,
  capability_statement TEXT NOT NULL,
  
  validator_id UUID REFERENCES validators(id),
  validator_comment TEXT,
  validated_at TIMESTAMPTZ,
  
  status TEXT DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  issued_at TIMESTAMPTZ
);
```

---

## 9. API Endpoints

### 9.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth | Login or signup |
| GET | /api/auth | Verify token |

### 9.2 Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reports/generate | Trigger AI report generation |
| GET | /api/reports/:id | Get specific report |
| POST | /api/reports/:id/publish | Make public |

### 9.3 Validation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/validate/queue | Get pending reports |
| POST | /api/validate/:id | Submit validation |

### 9.4 Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/credentials/:slug | Get credential |
| GET | /c/:slug | Public credential page |
| GET | /api/og/credential/:slug | Dynamic OG image |

---

## 10. Key Technical Decisions

### 10.1 Why Claude for Report Generation?

- **Sonnet 4** provides best balance of quality/speed
- Temperature 0.5 for warmth + accuracy
- Structured JSON output for parsing
- Context window handles full session history

### 10.2 Why Puppeteer for PDFs?

- HTML → PDF preserves styling exactly
- Matches web design perfectly
- @sparticuz/chromium for Vercel serverless
- Fallback: Railway service if issues

### 10.3 Why Supabase?

- PostgreSQL for relational data
- Built-in auth
- Row-level security
- Storage for PDFs
- Real-time subscriptions

### 10.4 Why Permanent URLs?

- Credentials are career assets
- SEO value
- Verifiable by recruiters
- Never expire

---

## 11. Security Considerations

### 11.1 Authentication
- Passwords hashed (bcrypt)
- JWT tokens with expiry
- Role-based access control

### 11.2 API Security
- Rate limiting on auth endpoints
- Input validation
- SQL injection prevention via parameterized queries

### 11.3 Data Protection
- Validator comments cannot be auto-generated
- Human verification required
- Public pages read-only

---

## 12. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://excellere.vercel.app
NEXT_PUBLIC_APP_NAME=Excellere

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Auth
JWT_SECRET=xxx
```

---

## 13. Deployment

### 13.1 Vercel
```bash
vercel --prod
```

### 13.2 Environment
- Production: Vercel
- Database: Supabase
- CDN: Vercel Edge Network

### 13.3 CI/CD
- Git push → automatic deploy
- Preview deployments for PRs

---

## 14. Future Enhancements

### Phase 2
- [ ] Multi-tenant for enterprise clients
- [ ] Custom branding for partners
- [ ] API for HR systems
- [ ] Analytics dashboard

### Phase 3
- [ ] Mobile apps
- [ ] Offline support
- [ ] AI coaching chat
- [ ] Peer assessment

---

## 15. Glossary

| Term | Definition |
|------|------------|
| Insight Report | AI-generated assessment after module completion |
| What Aria Noticed | Personalized observation section |
| Validator | Expert who signs credentials |
| Capability Statement | CV-ready paragraph |
| Share Slug | Unique URL identifier |
| Archetype | Cognitive thinking style |

---

## 16. Contact

For technical questions:
- **Email:** support@excellere.ai
- **Docs:** docs.excellere.ai

---

*Document Version: 1.0*
*Last Updated: February 2026*
