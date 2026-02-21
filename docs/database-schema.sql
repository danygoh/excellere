-- ============================================
-- EXCELLERE DATABASE SCHEMA - Complete
-- Version: 2026-02-21
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('learner', 'validator', 'admin')),
  
  -- Learner specific
  organisation TEXT,
  sector TEXT,
  job_title TEXT,
  
  -- Validator specific
  title TEXT,
  institution TEXT,
  bio TEXT,
  photo_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MODULES TABLE
-- ============================================
CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  outcome TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed modules in CORRECT learning order
INSERT INTO modules (id, name, description, outcome, order_index) VALUES
('ai-native-business-design', 'AI-Native Business Design', 'Audit which processes are AI-native vs augmented', 'AI-Native Firm Audit', 1),
('double-loop-strategy', 'Double Loop Strategy', 'Master the strategy framework for AI transformation', 'Double Loop Strategy Canvas', 2),
('agentic-ai', 'Agentic AI', 'Identify opportunities for agentic AI in your workflows', 'Agent Opportunity Map', 3);

-- ============================================
-- LEARNER PROFILES TABLE
-- ============================================
CREATE TABLE learner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Cognitive dimensions (0-100)
  strategic_vs_operational INTEGER DEFAULT 50,
  conceptual_vs_technical INTEGER DEFAULT 50,
  single_vs_double_loop INTEGER DEFAULT 50,
  challenge_vs_confirmation INTEGER DEFAULT 50,
  
  -- Computed
  archetype TEXT,
  archetype_description TEXT,
  
  -- AI prediction
  ai_prediction TEXT,
  profile_tags TEXT[],
  
  -- Additional fields
  primary_goal TEXT,
  cv_text TEXT,
  linkedin_url TEXT,
  onboarding_step INTEGER DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  calibration_answers JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONCEPT LIBRARY TABLE
-- ============================================
CREATE TABLE concept_library (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES modules(id),
  order_index INTEGER NOT NULL,
  name TEXT NOT summary TEXT,
  NULL,
  body_text TEXT NOT NULL,
  
  -- Sector-specific examples
  example_generic TEXT,
  example_fs TEXT,
  example_healthcare TEXT,
  example_tech TEXT,
  
  -- Teaching prompt
  teach_prompt TEXT NOT NULL,
  
  -- Questions per difficulty
  questions_medium JSONB,
  questions_hard JSONB,
  questions_very_hard JSONB,
  
  -- Scoring
  score_dimensions JSONB,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEARNER MODULES TABLE
-- ============================================
CREATE TABLE learner_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id),
  
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  UNIQUE(user_id, module_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id),
  concept_id TEXT,
  
  session_number INTEGER NOT NULL,
  session_type TEXT DEFAULT 'ai_practice' CHECK (session_type IN ('ai_practice', 'calibration', 'artefact')),
  
  -- Content
  topic TEXT NOT NULL,
  teach_back_response TEXT,
  ai_analysis JSONB,
  
  -- Phase tracking
  phase_reached TEXT DEFAULT 'understand' CHECK (phase_reached IN ('understand', 'teach', 'analyse', 'feedback', 'deeper', 'complete')),
  
  -- Metadata
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- KNOWLEDGE NODES TABLE
-- ============================================
CREATE TABLE knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  concept_id TEXT NOT NULL,
  
  -- Mastery state
  status TEXT DEFAULT 'unseen' CHECK (status IN ('unseen', 'introduced', 'taught', 'gap', 'mastered')),
  strength INTEGER DEFAULT 0,
  gap_flags TEXT[] DEFAULT '{}',
  
  -- Difficulty tracking
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'very_hard')),
  consecutive_correct INTEGER DEFAULT 0,
  
  -- Timestamps
  first_seen_at TIMESTAMPTZ,
  last_tested_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  
  UNIQUE(user_id, module_id, concept_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_nodes_user ON knowledge_nodes(user_id);
CREATE INDEX idx_knowledge_nodes_status ON knowledge_nodes(user_id, status);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  badge_description TEXT,
  evidence TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  shown_on_credential BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id, badge_type, module_id)
);

CREATE INDEX idx_badges_user ON badges(user_id);

-- Badge definitions (reference data)
CREATE TABLE badge_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL
);

INSERT INTO badge_definitions (id, name, icon, description, criteria) VALUES
('strategic_reframer', 'Strategic Reframer', '🎯', 'Questions the premise before answering within it', '{"reframe_count": 2}'),
('double_loop_thinker', 'Double Loop Thinker', '🔄', 'Demonstrated second-order reasoning unprompted', '{"double_loop_sessions": 2}'),
('context_applier', 'Context Applier', '🏢', 'Consistently applies concepts to own context', '{"context_score": 75, "session_count": 3}'),
('gap_closer', 'Gap Closer', '📈', 'Identified a gap and closed it within the same module', '{"gap_to_mastered": true}'),
('precision_thinker', 'Precision Thinker', '🎯', 'Named the specific mechanism, not just the concept', '{"accuracy_score": 85, "session_count": 2}'),
('ai_native_architect', 'AI-Native Architect', '🏛️', 'Artefact assessed as board-ready by expert', '{"board_readiness": 80}');

-- ============================================
-- ARTEFACTS TABLE
-- ============================================
CREATE TABLE artefacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id),
  
  title TEXT NOT NULL,
  content JSONB,
  type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'validated')),
  
  strength_scores JSONB,
  board_readiness INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSIGHT REPORTS TABLE
-- ============================================
CREATE TABLE insight_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  
  -- Claude-generated content
  report_content JSONB NOT NULL,
  ai_generated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Scores
  overall_score INTEGER,
  mastery_percentage INTEGER,
  
  -- Badges
  badges JSONB DEFAULT '[]',
  
  -- Validation status
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'in_review', 'validated', 'rejected')),
  validator_id UUID REFERENCES users(id),
  validator_comment TEXT,
  validated_at TIMESTAMPTZ,
  
  -- Sharing
  share_slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  share_enabled_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  
  -- PDFs
  pdf_url TEXT,
  validated_pdf_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VALIDATORS TABLE
-- ============================================
CREATE TABLE validators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed validators
INSERT INTO validators (name, title, institution, bio, email) VALUES
('Prof. Mark Esposito', 'Professor of Business & Economics', 'Harvard University / Hult International Business School', 'One of the world''s leading thinkers on AI strategy', 'mark@excellere.ai'),
('Prof. Terence Tse', 'Professor of Finance & AI Transformation', 'ESCP Business School', 'Expert in digital transformation and AI strategy', 'terence@excellere.ai'),
('Danny Goh', 'AI Strategy Practitioner & Executive Educator', 'Excellere', 'Practitioner-educator specialising in AI fluency', 'danny@excellere.ai');

-- ============================================
-- VALIDATION QUEUE TABLE
-- ============================================
CREATE TABLE validation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES insight_reports(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES validators(id),
  
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'opened', 'validated', 'rejected')),
  validator_notes TEXT,
  score_override INTEGER,
  assessment TEXT CHECK (assessment IN ('validated', 'needs_revision', 'exceptional')),
  
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ============================================
-- CREDENTIALS TABLE
-- ============================================
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  credential_slug TEXT UNIQUE NOT NULL,
  capability_statement TEXT NOT NULL,
  
  -- Validation
  validator_id UUID REFERENCES validators(id),
  validator_comment TEXT,
  validated_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'public')),
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_learner_modules_user ON learner_modules(user_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_module ON sessions(module_id);
CREATE INDEX idx_insight_reports_user ON insight_reports(user_id);
CREATE INDEX idx_insight_reports_slug ON insight_reports(share_slug);
CREATE INDEX idx_validation_queue_status ON validation_queue(status);
CREATE INDEX idx_validation_queue_validator ON validation_queue(validator_id);
