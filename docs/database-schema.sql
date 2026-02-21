// Database Schema - All tables for Excellere
// Run these in Supabase SQL Editor

// ============================================
// USERS TABLE
// ============================================
-- Users table (learners, validators, admins)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('learner', 'validator', 'admin')),
  
  -- Learner specific fields
  organisation TEXT,
  sector TEXT,
  job_title TEXT,
  
  -- Validator specific fields
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
// LEARNER PROFILES TABLE
// ============================================
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
  
  -- Additional fields
  primary_goal TEXT,
  cv_text TEXT,
  linkedin_url TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  ai_prediction TEXT,
  calibration_answers JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
// MODULES TABLE
// ============================================
CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  outcome TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed modules in correct order
INSERT INTO modules (id, name, description, outcome, order_index) VALUES
('ai-native-business-design', 'AI-Native Business Design', 'Audit which processes are AI-native vs augmented', 'AI-Native Firm Audit', 1),
('double-loop-strategy', 'Double Loop Strategy', 'Master the strategy framework for AI transformation', 'Double Loop Strategy Canvas', 2),
('agentic-ai', 'Agentic AI', 'Identify opportunities for agentic AI in your workflows', 'Agent Opportunity Map', 3);

-- ============================================
// LEARNER MODULES TABLE
// ============================================
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
// SESSIONS TABLE
// ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES modules(id),
  concept_id TEXT,
  session_number INTEGER NOT NULL,
  
  -- Session content
  topic TEXT NOT NULL,
  teach_back_response TEXT,
  ai_analysis JSONB,
  
  -- Session metadata
  phase_reached TEXT DEFAULT 'understand' CHECK (phase_reached IN ('understand', 'teach', 'analyse', 'feedback')),
  session_type TEXT DEFAULT 'ai_practice' CHECK (session_type IN ('ai_practice', 'calibration', 'artefact')),
  duration_seconds INTEGER,
  
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
// KNOWLEDGE NODES TABLE (Critical for adaptive learning)
// ============================================
CREATE TABLE knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  module_id TEXT REFERENCES modules(id),
  
  -- Mastery levels (0-100)
  mastery_level INTEGER DEFAULT 0,
  times_practiced INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  
  -- Adaptive difficulty
  current_difficulty INTEGER DEFAULT 1,
  streak_correct INTEGER DEFAULT 0,
  streak_incorrect INTEGER DEFAULT 0,
  
  -- Learning data
  last_practiced_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  ease_factor FLOAT DEFAULT 2.5,
  
  UNIQUE(user_id, concept_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
// ARTEFACTS TABLE
// ============================================
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
// INSIGHT REPORTS TABLE
// ============================================
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
  
  -- Badges (now proper table reference)
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
// BADGES TABLE (Proper records, not JSONB)
// ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  evidence TEXT,
  
  shown_on_credential BOOLEAN DEFAULT TRUE,
  
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge types
INSERT INTO badges (user_id, badge_type, badge_name, badge_description, evidence) VALUES
-- Strategic Reframer badge criteria: Chose reframing answers in 2+ calibration/session questions
-- Double Loop Thinker badge criteria: AI analysis flagged double-loop reasoning in 2+ teach-backs
-- Context Applier badge criteria: applied_to_own_context score > 75 in 3+ sessions
-- Gap Closer badge criteria: A concept moved from gap status to mastered within the module
-- Precision Thinker badge criteria: concept_accuracy > 85 in 2+ teach-backs
-- AI-Native Architect badge criteria: artefact board_readiness > 80 AND validator approved
(NULL, 'strategic_reframer', 'Strategic Reframer', 'Questions the premise before answering within it', 'Criteria: Chose reframing answers in 2+ questions'),
(NULL, 'double_loop_thinker', 'Double Loop Thinker', 'Demonstrated second-order reasoning unprompted', 'Criteria: Double-loop detected in 2+ teach-backs'),
(NULL, 'context_applier', 'Context Applier', 'Consistently firm context', ' applied concepts to ownCriteria: Applied to own context in 3+ sessions'),
(NULL, 'gap_closer', 'Gap Closer', 'Identified a gap and closed it within the same module', 'Criteria: Gap moved to mastered within module'),
(NULL, 'precision_thinker', 'Precision Thinker', 'Named the specific mechanism, not just the concept', 'Criteria: Concept accuracy > 85 in 2+ teach-backs'),
(NULL, 'ai_native_architect', 'AI-Native Architect', 'Artefact assessed as board-ready by expert', 'Criteria: Board readiness > 80 AND validated');

-- ============================================
// VALIDATORS TABLE
// ============================================
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
('Prof. Mark Esposito', 'Professor of Business & Economics', 'Harvard University / Hult International Business School', 'One of the world''s leading thinkers on AI strategy, exponential technologies, and the future of business.', 'mark@excellere.ai'),
('Prof. Terence Tse', 'Professor of Finance & AI Transformation', 'ESCP Business School', 'Expert in digital transformation, AI strategy, and the intersection of finance and emerging technology.', 'terence@excellere.ai'),
('Danny Goh', 'AI Strategy Practitioner & Executive Educator', 'Excellere', 'Practitioner-educator specialising in helping senior leaders build genuine AI fluency.', 'danny@excellere.ai');

-- ============================================
// VALIDATION QUEUE TABLE
// ============================================
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
// CREDENTIALS TABLE (Full Programme)
// ============================================
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  credential_slug TEXT UNIQUE NOT NULL,
  
  -- Content
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
// INDEXES FOR PERFORMANCE
// ============================================
CREATE INDEX idx_learner_modules_user ON learner_modules(user_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_module ON sessions(module_id);
CREATE INDEX idx_knowledge_nodes_user ON knowledge_nodes(user_id);
CREATE INDEX idx_insight_reports_user ON insight_reports(user_id);
CREATE INDEX idx_insight_reports_slug ON insight_reports(share_slug);
CREATE INDEX idx_badges_user ON badges(user_id);
CREATE INDEX idx_validation_queue_status ON validation_queue(status);
CREATE INDEX idx_validation_queue_validator ON validation_queue(validator_id);

-- ============================================
// ROW LEVEL SECURITY (Optional - for production)
// ============================================
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own profile" ON learner_profiles
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Validators can read all reports
CREATE POLICY "Validators can read all reports" ON insight_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'validator')
  );
