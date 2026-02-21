// Database service for Excellere Credentials - JSON file-based
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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
    id: 'validator-mark',
    name: 'Prof. Mark Esposito',
    title: 'Professor of Business & Economics',
    institution: 'Harvard University / Hult International Business School',
    bio: "One of the world's leading thinkers on AI strategy, exponential technologies, and the future of business.",
    photo_url: '/images/validators/mark-esposito.jpg',
    email: 'mark@excellere.ai',
    active: true
  },
  {
    id: 'validator-terence',
    name: 'Prof. Terence Tse',
    title: 'Professor of Finance & AI Transformation',
    institution: 'ESCP Business School',
    bio: 'Expert in digital transformation, AI strategy, and the intersection of finance and emerging technology.',
    photo_url: '/images/validators/terence-tse.jpg',
    email: 'terence@excellere.ai',
    active: true
  },
  {
    id: 'validator-danny',
    name: 'Danny Goh',
    title: 'AI Strategy Practitioner & Executive Educator',
    institution: 'Excellere',
    bio: 'Practitioner-educator specialising in helping senior leaders build genuine AI fluency.',
    photo_url: '/images/validators/danny-goh.jpg',
    email: 'danny@excellere.ai',
    active: true
  }
];

// Initialize validators if not exists
const validatorsDb = getDb('validators');
if (validatorsDb.length === 0) {
  saveDb('validators', validators);
  console.log('✓ Validators seeded');
}

// Badge criteria
export const BADGE_CRITERIA = {
  'strategic_reframer': { name: 'Strategic Reframer', icon: '🦅', description: 'Questions the premise before answering within it' },
  'double_loop_thinker': { name: 'Double Loop Thinker', icon: '🔁', description: 'Demonstrated second-order reasoning unprompted' },
  'context_applier': { name: 'Context Applier', icon: '🎯', description: 'Consistently applied concepts to own firm context' },
  'gap_closer': { name: 'Gap Closer', icon: '⚡', description: 'Identified a gap and closed it within the same module' },
  'precision_thinker': { name: 'Precision Thinker', icon: '🔬', description: 'Named the specific mechanism, not just the concept' },
  'ai_native_architect': { name: 'AI-Native Architect', icon: '🏗️', description: 'Artefact assessed as board-ready by expert' }
};

export default {
  getValidators: () => getDb('validators'),
  getValidatorById: (id) => getDb('validators').find(v => v.id === id),
  getValidatorByEmail: (email) => getDb('validators').find(v => v.email === email),

  getInsightReports: () => getDb('insight_reports'),
  getInsightReportById: (id) => getDb('insight_reports').find(r => r.id === id),
  getInsightReportBySlug: (slug) => getDb('insight_reports').find(r => r.share_slug === slug),
  
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
  }
};
