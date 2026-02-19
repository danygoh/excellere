'use client'

import { useState } from 'react'
import styles from './artefact.module.css'

export default function ArtefactBuilder() {
  const [content, setContent] = useState(`# AI-Native Firm Audit

## Executive Summary
[Your AI-native audit summary goes here]

## Process Assessment

| Process | Current State | AI Potential | Recommendation |
|---------|--------------|-------------|----------------|
|         |              |             |                |

## Key Findings

1. 

## Recommendations

-

## Next Steps

- 
`)

  const [suggestions, setSuggestions] = useState([])
  const [strength, setStrength] = useState(45)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const artefactType = 'AI-Native Firm Audit'

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setSuggestions([
        {
          section: 'Executive Summary',
          issue: 'Too generic - needs specific metrics',
          suggestion: 'Add quantified impact estimates (e.g., "30% reduction in processing time")'
        },
        {
          section: 'Process Assessment',
          issue: 'Missing competitive context',
          suggestion: 'Compare your AI maturity to industry benchmarks'
        }
      ])
      setStrength(65)
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.backLink}>← Back to Dashboard</div>
        <div className={styles.artefactTitle}>{artefactType}</div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary}>Export PDF</button>
          <button className={styles.btnPrimary}>Save</button>
        </div>
      </header>

      <div className={styles.main}>
        {/* Editor */}
        <div className={styles.editor}>
          <textarea
            className={styles.editorInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start building your artefact..."
          />
        </div>

        {/* AI Sidebar */}
        <aside className={styles.sidebar}>
          {/* Strength Meter */}
          <div className={styles.strengthCard}>
            <h3>Document Strength</h3>
            <div className={styles.strengthMeter}>
              <div 
                className={styles.strengthFill} 
                style={{ width: `${strength}%` }}
              ></div>
            </div>
            <div className={styles.strengthLabel}>{strength}%</div>
          </div>

          {/* AI Suggestions */}
          <div className={styles.suggestionsCard}>
            <h3>AI Suggestions</h3>
            
            {isAnalyzing ? (
              <div className={styles.analyzing}>
                <div className={styles.animateIcon}>🤖</div>
                <p>Analyzing your document...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className={styles.suggestionsList}>
                {suggestions.map((s, i) => (
                  <div key={i} className={styles.suggestion}>
                    <div className={styles.suggestionSection}>{s.section}</div>
                    <div className={styles.suggestionIssue}>{s.issue}</div>
                    <div className={styles.suggestionText}>{s.suggestion}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noSuggestions}>
                Click "Get Suggestions" to analyze your document
              </p>
            )}

            <button 
              className={styles.btnAnalyze}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Get Suggestions'}
            </button>
          </div>

          {/* Milestones */}
          <div className={styles.milestonesCard}>
            <h3>Milestones</h3>
            <div className={styles.milestones}>
              <div className={styles.milestone}>
                <span className={styles.milestoneDot}></span>
                <span>Define processes</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneDot}></span>
                <span>Assess current state</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneDot}></span>
                <span>Identify opportunities</span>
              </div>
              <div className={`${styles.milestone} ${styles.pending}`}>
                <span className={styles.milestoneDot}></span>
                <span>Final recommendations</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
