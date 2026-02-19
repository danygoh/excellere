'use client'

import { useState } from 'react'
import styles from './live.module.css'

export default function LiveSession() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Facilitator', text: 'Welcome to today\'s cohort session on AI-Native Business Design!', time: '2:00 PM' },
    { id: 2, user: 'Sarah C.', text: 'Excited to be here!', time: '2:01 PM' },
    { id: 3, user: 'Mike R.', text: 'Looking forward to the discussion on competitive moats.', time: '2:02 PM' },
  ])
  const [newMessage, setNewMessage] = useState('')

  const participants = [
    { name: 'You', role: 'Learner', status: 'active' },
    { name: 'Sarah C.', role: 'Head of Strategy', status: 'active' },
    { name: 'Mike R.', role: 'VP Operations', status: 'thinking' },
    { name: 'Lisa T.', role: 'CFO', status: 'active' },
    { name: 'James K.', role: 'CTO', status: 'away' },
  ]

  const handleSend = () => {
    if (!newMessage.trim()) return
    setMessages([...messages, {
      id: Date.now(),
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setNewMessage('')
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div>← Back</div>
        <div className={styles.sessionInfo}>
          <h2>Live Cohort: AI-Native Business Design</h2>
          <span className={styles.liveBadge}>● LIVE</span>
        </div>
        <div>Leave</div>
      </header>

      <div className={styles.main}>
        {/* Video Area */}
        <div className={styles.videoArea}>
          <div className={styles.videoGrid}>
            <div className={styles.videoBox}>
              <div className={styles.presenter}>
                <div className={styles.avatar}>JM</div>
                <div className={styles.name}>John (Facilitator)</div>
              </div>
            </div>
            <div className={styles.videoBox}>
              <div className={styles.participantList}>
                <div className={styles.participantListTitle}>Participants (5)</div>
                {participants.map((p, i) => (
                  <div key={i} className={styles.participant}>
                    <span className={`${styles.statusDot} ${styles[p.status]}`}></span>
                    <span>{p.name}</span>
                    <span className={styles.role}>{p.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className={styles.chatArea}>
            <div className={styles.chatMessages}>
              {messages.map(msg => (
                <div key={msg.id} className={styles.message}>
                  <span className={styles.msgUser}>{msg.user}</span>
                  <span className={styles.msgTime}>{msg.time}</span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className={styles.chatInput}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>

        {/* AI Coach Sidebar */}
        <aside className={styles.aiSidebar}>
          <div className={styles.aiHeader}>
            <span>🤖</span> Your AI Coach
          </div>
          
          <div className={styles.aiCoach}>
            <div className={styles.coachInsight}>
              <h4>Current Focus</h4>
              <p>The discussion is on competitive moats. In your sector (FinTech), consider how AI creates defensible advantages through proprietary data and network effects.</p>
            </div>

            <div className={styles.coachInsight}>
              <h4>Your Patterns</h4>
              <p>You've been active in strategic discussions. Your questions about competitive advantage show strong double-loop thinking.</p>
            </div>

            <div className={styles.coachSuggestion}>
              <h4>💡 Suggestion</h4>
              <p>Consider sharing your experience with the AI-Native audit you're building. Real examples resonate with this cohort.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
