// Database service - Supabase-based
// Uses JSON files as fallback for local development

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

// Initialize Supabase client
let supabase = null;

function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return supabase;
}

function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

// JSON file fallback functions
function getDb(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveDb(name, data) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Validators (seed data)
export const validators = [
  {
    id: uuidv4(),
    name: 'Prof. Mark Esposito',
    title: 'Professor of Business & Economics',
    institution: 'Harvard University / Hult International Business School',
    bio: "One of the world's leading thinkers on AI strategy, exponential technologies, and the future of business.",
    photo_url: '/images/validators/mark-esposito.jpg',
    email: 'mark@excellere.ai',
    active: true
  },
  {
    id: uuidv4(),
    name: 'Prof. Terence Tse',
    title: 'Professor of Finance & AI Transformation',
    institution: 'ESCP Business School',
    bio: 'Expert in digital transformation, AI strategy, and the intersection of finance and emerging technology.',
    photo_url: '/images/validators/terence-tse.jpg',
    email: 'terence@excellere.ai',
    active: true
  },
  {
    id: uuidv4(),
    name: 'Danny Goh',
    title: 'AI Strategy Practitioner & Executive Educator',
    institution: 'Excellere',
    bio: 'Practitioner-educator specialising in helping senior leaders build genuine AI fluency.',
    photo_url: '/images/validators/danny-goh.jpg',
    email: 'danny@excellere.ai',
    active: true
  }
];

// Badge criteria
export const BADGE_CRITERIA = {
  'strategic_reframer': { name: 'Strategic Reframer', icon: '🦅', description: 'Questions the premise before answering within it' },
  'double_loop_thinker': { name: 'Double Loop Thinker', icon: '🔁', description: 'Demonstrated second-order reasoning unprompted' },
  'context_applier': { name: 'Context Applier', icon: '🎯', description: 'Consistently applied concepts to own firm context' },
  'gap_closer': { name: 'Gap Closer', icon: '⚡', description: 'Identified a gap and closed it within the same module' },
  'precision_thinker': { name: 'Precision Thinker', icon: '🔬', description: 'Named the specific mechanism, not just the concept' },
  'ai_native_architect': { name: 'AI-Native Architect', icon: '🏗️', description: 'Artefact assessed as board-ready by expert' }
};

// Initialize validators if using JSON
if (!isSupabaseConfigured()) {
  const validatorsDb = getDb('validators');
  if (validatorsDb.length === 0) {
    saveDb('validators', validators);
    console.log('✓ Validators seeded (JSON mode)');
  }
}

// ============================================
// CONTENT FUNCTIONS
// ============================================

// Get all active modules
export async function getModules() {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.from('modules').select('*').eq('is_active', true).order('order_index');
    if (!error) return data;
  }
  // Fallback
  return getDb('modules').filter(m => m.is_active);
}

// Get single module with concepts
export async function getModule(moduleId) {
  const supabase = getSupabase();
  if (supabase) {
    const { data: module } = await supabase.from('modules').select('*').eq('id', moduleId).single();
    const { data: concepts } = await supabase.from('concept_library').select('id, name, summary, order_index').eq('module_id', moduleId).eq('is_active', true).order('order_index');
    if (module) return { ...module, concepts };
  }
  // Fallback
  const modules = getDb('modules');
  const module = modules.find(m => m.id === moduleId);
  const concepts = getDb('concepts').filter(c => c.module_id === moduleId && c.is_active);
  return { ...module, concepts };
}

// Get single concept (without scoring dimensions)
export async function getConcept(conceptId, learnerSector = null) {
  const supabase = getSupabase();
  if (supabase) {
    const { data: concept } = await supabase.from('concept_library').select('*').eq('id', conceptId).single();
    if (concept) {
      // Filter sector example
      if (learnerSector) {
        const sectorKey = mapSectorToKey(learnerSector);
        concept.sector_example = concept[`example_${sectorKey}`] || concept.example_financial_services;
      }
      // Remove scoring dimensions from response
      delete concept.score_dimensions;
      delete concept.gap_flags;
    }
    return concept;
  }
  // Fallback
  const concepts = getDb('concepts');
  const concept = concepts.find(c => c.id === conceptId);
  if (concept && learnerSector) {
    const sectorKey = mapSectorToKey(learnerSector);
    concept.sector_example = concept[`example_${sectorKey}`] || concept.example_financial_services;
  }
  return concept;
}

// Get artefact template
export async function getArtefactTemplate(moduleId) {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('artefact_templates').select('*').eq('module_id', moduleId).single();
    return data;
  }
  // Fallback
  const templates = getDb('artefacts');
  return templates.find(t => t.module_id === moduleId);
}

// Helper to map sector to key
function mapSectorToKey(sector) {
  const map = {
    'financial services': 'financial_services',
    'banking': 'financial_services',
    'fintech': 'financial_services',
    'healthcare': 'healthcare',
    'health': 'healthcare',
    'medical': 'healthcare',
    'professional services': 'professional_services',
    'consulting': 'professional_services',
    'law': 'professional_services',
    'legal': 'professional_services'
  };
  return map[sector?.toLowerCase()] || 'financial_services';
}

// ============================================
// ASSESSMENT FUNCTIONS
// ============================================

// Get assessment questions (shuffled by dimension)
export async function getAssessmentQuestions() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('assessment_questions').select('*').eq('is_active', true).order('order_index');
    if (data) {
      // Parse options JSON string to object
      return data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
    }
  }
  // Fallback - shuffle
  const questions = getDb('assessment_questions').filter(q => q.is_active);
  return questions.sort(() => Math.random() - 0.5);
}

// Get scoring config
export async function getScoringConfig() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('assessment_config').select('*');
    return data;
  }
  return getDb('assessment_config');
}

// Get readiness stages
export async function getReadinessStages() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('readiness_stages').select('*').order('stage_number');
    return data;
  }
  return getDb('readiness_stages').sort((a, b) => a.stage_number - b.stage_number);
}

// Calculate assessment scores
export function calculateScores(answers, questions, config) {
  const dimensionScores = {};
  const dimensionCounts = {};
  
  // Initialize
  config.forEach(c => {
    dimensionScores[c.dimension] = 0;
    dimensionCounts[c.dimension] = 0;
  });
  
  // Calculate
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.question_id);
    if (question) {
      const option = question.options.find(o => o.id === answer.selected_option);
      if (option) {
        const points = option.signal_strength === 'strong' ? 100 : option.signal_strength === 'moderate' ? 60 : 20;
        dimensionScores[question.dimension] += points;
        dimensionCounts[question.dimension]++;
      }
    }
  });
  
  // Normalize to 0-100
  const normalizedScores = {};
  Object.keys(dimensionScores).forEach(dim => {
    const maxPoints = dimensionCounts[dim] * 100;
    normalizedScores[dim] = maxPoints > 0 ? Math.round((dimensionScores[dim] / maxPoints) * 100) : 0;
  });
  
  // Calculate weighted overall
  let weightedSum = 0;
  config.forEach(c => {
    weightedSum += normalizedScores[c.dimension] * c.weight;
  });
  
  const overallScore = Math.round(weightedSum);
  
  // Get stage
  const stages = getReadinessStages();
  const stage = stages.find(s => overallScore >= s.score_min && overallScore <= s.score_max);
  
  return { dimensionScores: normalizedScores, overallScore, stage };
}

// ============================================
// VALIDATORS (reusing existing)
// ============================================

export async function getValidators() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('validators').select('*').eq('active', true);
    return data;
  }
  return getDb('validators').filter(v => v.active);
}

export async function getValidatorById(id) {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('validators').select('*').eq('id', id).single();
    return data;
  }
  return getDb('validators').find(v => v.id === id);
}

// ============================================
// INSIGHT REPORTS
// ============================================

export async function getInsightReports() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('insight_reports').select('*').order('created_at', { ascending: false });
    return data;
  }
  return getDb('insight_reports');
}

export async function getInsightReportBySlug(slug) {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('insight_reports').select('*').eq('share_slug', slug).single();
    return data;
  }
  return getDb('insight_reports').find(r => r.share_slug === slug);
}

export async function createInsightReport(report) {
  const supabase = getSupabase();
  const newReport = {
    id: uuidv4(),
    ...report,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (supabase) {
    const { data, error } = await supabase.from('insight_reports').insert(newReport).select().single();
    return data;
  }
  
  const reports = getDb('insight_reports');
  reports.push(newReport);
  saveDb('insight_reports', reports);
  return newReport;
}

// ============================================
// LEGACY FUNCTIONS (for existing API compatibility)
// ============================================

export default {
  // Validators
  getValidators,
  getValidatorById,
  
  // Content
  getModules,
  getModule,
  getConcept,
  getArtefactTemplate,
  
  // Assessment
  getAssessmentQuestions,
  getScoringConfig,
  getReadinessStages,
  calculateScores,
  
  // Reports
  getInsightReports,
  getInsightReportBySlug,
  createInsightReport,
  
  // Legacy (JSON-based)
  getInsightReports: () => getDb('insight_reports'),
  getInsightReportById: (id) => getDb('insight_reports').find(r => r.id === id),
  createInsightReport: (report) => {
    const reports = getDb('insight_reports');
    const newReport = { id: uuidv4(), ...report, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    reports.push(newReport);
    saveDb('insight_reports', reports);
    return newReport;
  },
  updateInsightReport: (id, updates) => {
    const reports = getDb('insight_reports');
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates, updated_at: new Date().toISOString() };
      saveDb('insight_reports', reports);
      return reports[index];
    }
    return null;
  },
  getCredentials: () => getDb('credentials'),
  getCredentialById: (id) => getDb('credentials').find(c => c.id === id),
  getCredentialBySlug: (slug) => getDb('credentials').find(c => c.credential_slug === slug),
  createCredential: (credential) => {
    const credentials = getDb('credentials');
    const newCredential = { id: uuidv4(), ...credential, created_at: new Date().toISOString() };
    credentials.push(newCredential);
    saveDb('credentials', credentials);
    return newCredential;
  },
  getBadges: () => getDb('badges'),
  getBadgesByUserId: (userId) => getDb('badges').filter(b => b.user_id === userId),
  createBadge: (badge) => {
    const badges = getDb('badges');
    const newBadge = { id: uuidv4(), ...badge, earned_at: new Date().toISOString() };
    badges.push(newBadge);
    saveDb('badges', badges);
    return newBadge;
  },
  getValidationQueue: () => getDb('validation_queue'),
  addToValidationQueue: (item) => {
    const queue = getDb('validation_queue');
    const newItem = { id: uuidv4(), ...item, status: 'queued', assigned_at: new Date().toISOString() };
    queue.push(newItem);
    saveDb('validation_queue', queue);
    return newItem;
  },
  getTestProfiles: () => getDb('test_profiles'),
  getTestProfileById: (id) => getDb('test_profiles').find(p => p.id === id),
  createTestProfile: (profile) => {
    const profiles = getDb('test_profiles');
    const newProfile = { id: uuidv4(), ...profile, created_at: new Date().toISOString() };
    profiles.push(newProfile);
    saveDb('test_profiles', profiles);
    return newProfile;
  }
};
