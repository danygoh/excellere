'use client'

import { useState, useEffect } from 'react'
import db from '@/lib/database'

const MODULES = [
  { id: 'ai-native-business-design', name: 'AI-Native Business Design' },
  { id: 'double-loop-strategy', name: 'Double Loop Strategy' },
  { id: 'agentic-ai', name: 'Agentic AI' },
]

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConcepts()
  }, [])

  const loadConcepts = async () => {
    try {
      const modules = await db.getModules()
      const allConcepts = []
      for (const mod of modules) {
        const full = await db.getModule(mod.id)
        if (full?.concepts) {
          allConcepts.push(...full.concepts.map(c => ({ ...c, moduleName: mod.name })))
        }
      }
      setConcepts(allConcepts)
    } catch (err) {
      console.error('Failed to load concepts:', err)
    } finally {
      setLoading(false)
    }
  }

  const conceptsByModule = MODULES.map(mod => ({
    ...mod,
    concepts: concepts.filter(c => c.module_id === mod.id).sort((a, b) => a.order_index - b.order_index)
  }))

  if (loading) {
    return <div className="admin-main"><div className="empty-state">Loading...</div></div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Concepts</h1>
          <p className="page-subtitle">View and manage course content</p>
        </div>
      </div>

      {conceptsByModule.map(mod => (
        <div key={mod.id} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--amber)' }}>
            {mod.name} ({mod.concepts.length} concepts)
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {mod.concepts.map((concept, idx) => (
              <div key={concept.id} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {idx + 1}. {concept.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                      {concept.summary?.substring(0, 100)}...
                    </div>
                  </div>
                  <span className={`badge ${concept.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {concept.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Edit in Content Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
