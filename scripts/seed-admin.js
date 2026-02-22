// Seed script for students and validation queue
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eynlsmqdhrbcgwjrgzjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bmxzbXFkaHJiY2d3anJnemp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY5ODQ2NCwiZXhwIjoyMDg3Mjc0NDY0fQ.A_BjVDdYiZjd2Veb4nWMtcpmnEqubjuaYqIiKtvbQv4'

const supabase = createClient(supabaseUrl, supabaseKey)

// Seed students
const students = [
  {
    first_name: 'Sarah',
    last_name: 'Chen',
    email: 'sarah.chen@techcorp.com',
    job_title: 'CEO',
    sector: 'Financial Services',
    organisation: 'TechCorp Ltd',
    onboarding_complete: true,
    sessions_completed: 8,
    sessions_total: 12,
    readiness_score: 72,
    stage: 'AI Fluent',
    validator_id: 'v1',
    status: 'active',
    last_active: new Date().toISOString()
  },
  {
    first_name: 'James',
    last_name: 'Wilson',
    email: 'james.wilson@healthplus.com',
    job_title: 'COO',
    sector: 'Healthcare',
    organisation: 'HealthPlus',
    onboarding_complete: true,
    sessions_completed: 12,
    sessions_total: 12,
    readiness_score: 85,
    stage: 'AI Native',
    validator_id: 'v2',
    status: 'completed',
    last_active: new Date(Date.now() - 86400000).toISOString()
  },
  {
    first_name: 'Emma',
    last_name: 'Davis',
    email: 'emma.davis@consulting.co',
    job_title: 'Director of AI',
    sector: 'Professional Services',
    organisation: 'Consulting Co',
    onboarding_complete: true,
    sessions_completed: 4,
    sessions_total: 12,
    readiness_score: 58,
    stage: 'AI Informed',
    validator_id: null,
    status: 'stalled',
    last_active: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@finbank.com',
    job_title: 'CTO',
    sector: 'Financial Services',
    organisation: 'FinBank',
    onboarding_complete: true,
    sessions_completed: 6,
    sessions_total: 12,
    readiness_score: 65,
    stage: 'AI Fluent',
    validator_id: 'v1',
    status: 'active',
    last_active: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    first_name: 'Lisa',
    last_name: 'Anderson',
    email: 'lisa.anderson@medtech.io',
    job_title: 'VP Innovation',
    sector: 'Healthcare',
    organisation: 'MedTech IO',
    onboarding_complete: false,
    sessions_completed: 2,
    sessions_total: 12,
    readiness_score: 42,
    stage: 'AI Curious',
    validator_id: 'v3',
    status: 'active',
    last_active: new Date().toISOString()
  }
]

// Seed validation queue
const validationQueue = [
  {
    student_id: '1',
    module_id: 'ai-native-business-design',
    report_type: 'Assessment Report',
    status: 'pending',
    days_waiting: 3,
    validator_id: 'v1',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    student_id: '3',
    module_id: 'double-loop-strategy',
    report_type: 'Programme Report',
    status: 'pending',
    days_waiting: 6,
    validator_id: null,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    student_id: '4',
    module_id: 'agentic-ai',
    report_type: 'Assessment Report',
    status: 'in_progress',
    days_waiting: 1,
    validator_id: 'v2',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
]

async function seed() {
  console.log('Seeding students...')
  for (const student of students) {
    const { data, error } = await supabase.from('students').insert(student).select()
    if (error) {
      console.log('Student insert error:', error.message)
    } else {
      console.log('Inserted student:', student.first_name, student.last_name)
    }
  }

  console.log('\nSeeding validation queue...')
  for (const item of validationQueue) {
    const { data, error } = await supabase.from('validation_queue').insert(item).select()
    if (error) {
      console.log('Validation queue insert error:', error.message)
    } else {
      console.log('Inserted validation item')
    }
  }

  console.log('\nDone!')
}

seed()
