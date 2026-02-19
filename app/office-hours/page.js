'use client'

import { useState } from 'react'
import styles from './office.module.css'

export default function OfficeHours() {
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [booked, setBooked] = useState(false)
  
  // Mock available slots
  const slots = [
    { id: 1, date: 'Tomorrow', time: '10:00 AM', expert: 'Dr. James Wilson', topic: 'AI Strategy', available: true },
    { id: 2, date: 'Tomorrow', time: '2:00 PM', expert: 'Dr. James Wilson', topic: 'AI Strategy', available: false },
    { id: 3, date: 'Feb 21', time: '11:00 AM', expert: 'Sarah Chen', topic: 'FinTech AI', available: true },
    { id: 4, date: 'Feb 22', time: '3:00 PM', expert: 'Mike Roberts', topic: 'Operations AI', available: true },
    { id: 5, date: 'Feb 23', time: '10:00 AM', expert: 'Dr. James Wilson', topic: 'AI Strategy', available: true },
    { id: 6, date: 'Feb 24', time: '4:00 PM', expert: 'Lisa Thompson', topic: 'CFO AI Tools', available: true },
  ]

  const experts = [
    { name: 'Dr. James Wilson', role: 'AI Strategy Expert', sessions: 45, rating: 4.9 },
    { name: 'Sarah Chen', role: 'FinTech AI Leader', sessions: 32, rating: 4.8 },
    { name: 'Mike Roberts', role: 'Operations AI', sessions: 28, rating: 4.7 },
    { name: 'Lisa Thompson', role: 'CFO AI Tools', sessions: 22, rating: 4.9 },
  ]

  const handleBook = () => {
    setBooked(true)
    setSelectedSlot(null)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>← Back to Dashboard</div>
        <h1>Office Hours</h1>
        <div></div>
      </header>

      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Upcoming Sessions</h2>
            {booked ? (
              <div className={styles.bookedConfirmation}>
                <span>✅</span>
                <h3>Session Booked!</h3>
                <p>You'll receive a confirmation email with the meeting link.</p>
                <button onClick={() => setBooked(false)}>Book Another</button>
              </div>
            ) : (
              <div className={styles.slotsGrid}>
                {slots.filter(s => s.available).map(slot => (
                  <div 
                    key={slot.id} 
                    className={`${styles.slotCard} ${selectedSlot?.id === slot.id ? styles.selected : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className={styles.slotDate}>{slot.date}</div>
                    <div className={styles.slotTime}>{slot.time}</div>
                    <div className={styles.slotExpert}>{slot.expert}</div>
                    <div className={styles.slotTopic}>{slot.topic}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSlot && !booked && (
            <div className={styles.bookingForm}>
              <h3>Book Session</h3>
              <p>You're booking with {selectedSlot.expert} on {selectedSlot.date} at {selectedSlot.time}</p>
              <div className={styles.formGroup}>
                <label>What would you like to discuss?</label>
                <textarea placeholder="Share your questions or topics..." rows={4}></textarea>
              </div>
              <button className={styles.btnPrimary} onClick={handleBook}>
                Confirm Booking
              </button>
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <h3>Expert Coaches</h3>
          <div className={styles.expertsList}>
            {experts.map((expert, i) => (
              <div key={i} className={styles.expertCard}>
                <div className={styles.expertAvatar}>{expert.name[0]}</div>
                <div>
                  <div className={styles.expertName}>{expert.name}</div>
                  <div className={styles.expertRole}>{expert.role}</div>
                  <div className={styles.expertStats}>
                    <span>{expert.sessions} sessions</span>
                    <span>•</span>
                    <span>⭐ {expert.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
