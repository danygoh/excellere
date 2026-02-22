// Database service - Supabase-based
// Uses JSON files as fallback for local development

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

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
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, '[]');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveDb(name, data) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
      if (learnerSector) {
        const sectorKey = mapSectorToKey(learnerSector);
        concept.sector_example = concept[`example_${sectorKey}`] || concept.example_financial_services;
      }
      delete concept.score_dimensions;
      delete concept.gap_flags;
    }
    return concept;
  }
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
  const templates = getDb('artefacts');
  return templates.find(t => t.module_id === moduleId);
}

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

export async function getAssessmentQuestions() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('assessment_questions').select('*').eq('is_active', true).order('order_index');
    if (data) {
      return data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
    }
  }
  return getDb('assessment_questions').filter(q => q.is_active);
}

export async function getScoringConfig() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('assessment_config').select('*');
    return data;
  }
  return getDb('assessment_config');
}

export async function getReadinessStages() {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('readiness_stages').select('*').order('stage_number');
    return data;
  }
  return getDb('readiness_stages').sort((a, b) => a.stage_number - b.stage_number);
}

export function calculateScores(answers, questions, config) {
  const dimensionScores = {};
  const dimensionCounts = {};
  
  config.forEach(c => {
    dimensionScores[c.dimension] = 0;
    dimensionCounts[c.dimension] = 0;
  });
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.question_id);
    if (question && question.options) {
      const option = question.options.find(o => o.id === answer.selected_option);
      if (option) {
        const points = option.signal_strength === 'strong' ? 100 : option.signal_strength === 'moderate' ? 60 : 20;
        dimensionScores[question.dimension] += points;
        dimensionCounts[question.dimension]++;
      }
    }
  });
  
  const normalizedScores = {};
  Object.keys(dimensionScores).forEach(dim => {
    const maxPoints = dimensionCounts[dim] * 100;
    normalizedScores[dim] = maxPoints > 0 ? Math.round((dimensionScores[dim] / maxPoints) * 100) : 0;
  });
  
  let weightedSum = 0;
  config.forEach(c => {
    weightedSum += normalizedScores[c.dimension] * c.weight;
  });
  
  const overallScore = Math.round(weightedSum);
  
  const stages = getReadinessStages();
  const stage = stages.find(s => overallScore >= s.score_min && overallScore <= s.score_max);
  
  return { dimensionScores: normalizedScores, overallScore, stage };
}

// ============================================
// VALIDATORS
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
    return data || [];
  }
  return getDb('insight_reports');
}

export async function getInsightReportById(id) {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from('insight_reports').select('*').eq('id', id).single();
    return data;
  }
  return getDb('insight_reports').find(r => r.id === id);
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
    if (!error) return data;
  }
  
  const reports = getDb('insight_reports');
  reports.push(newReport);
  saveDb('insight_reports', reports);
  return newReport;
}

export default {
  getValidators,
  getValidatorById,
  getModules,
  getModule,
  getConcept,
  getArtefactTemplate,
  getAssessmentQuestions,
  getScoringConfig,
  getReadinessStages,
  calculateScores,
  getInsightReports,
  getInsightReportById,
  getInsightReportBySlug,
  createInsightReport
};
