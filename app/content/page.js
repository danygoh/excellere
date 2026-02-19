'use client'

import { useState } from 'react'
import styles from './content.module.css'

export default function AsyncContent() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  
  // Mock video library
  const videos = [
    {
      id: 1,
      title: 'Introduction to AI-Native Business',
      module: 'AI-Native Business Design',
      duration: '12:34',
      thumbnail: '🎯',
      presenter: 'Dr. James Wilson',
      role: 'AI Strategy Expert'
    },
    {
      id: 2,
      title: 'The Three Layers of AI Maturity',
      module: 'AI-Native Business Design',
      duration: '18:22',
      thumbnail: '📊',
      presenter: 'Dr. James Wilson',
      role: 'AI Strategy Expert'
    },
    {
      id: 3,
      title: 'Case Study: Netflix Recommendation Engine',
      module: 'AI-Native Business Design',
      duration: '24:15',
      thumbnail: '🎬',
      presenter: 'Sarah Chen',
      role: 'Head of Strategy, FinTech'
    }
  ]

  const annotations = [
    { time: '2:34', text: 'Key point: AI-native means redesigning workflows, not automating existing ones' },
    { time: '5:12', text: 'Example: Amazon\'s logistics AI operates differently than traditional automation' },
    { time: '8:45', text: 'The compounding effect: each improvement benefits all future decisions' }
  ]

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div>← Back to Dashboard</div>
        <h1>Async Content</h1>
        <div></div>
      </header>

      <div className={styles.main}>
        {/* Video Library */}
        <aside className={styles.sidebar}>
          <h3>Video Library</h3>
          <div className={styles.videoList}>
            {videos.map(video => (
              <div 
                key={video.id} 
                className={`${styles.videoItem} ${selectedVideo?.id === video.id ? styles.active : ''}`}
                onClick={() => setSelectedVideo(video)}
              >
                <div className={styles.thumbnail}>{video.thumbnail}</div>
                <div className={styles.videoInfo}>
                  <div className={styles.videoTitle}>{video.title}</div>
                  <div className={styles.videoMeta}>
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span>{video.module}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Video Player */}
        <main className={styles.player}>
          {selectedVideo ? (
            <>
              <div className={styles.videoPlayer}>
                <div className={styles.videoPlaceholder}>
                  <span className={styles.playIcon}>▶</span>
                  <p>Video Player</p>
                  <p className={styles.videoName}>{selectedVideo.title}</p>
                </div>
              </div>

              {/* Annotations */}
              <div className={styles.annotations}>
                <h3>Smart Annotations</h3>
                <div className={styles.annotationList}>
                  {annotations.map((ann, i) => (
                    <div key={i} className={styles.annotation}>
                      <span className={styles.annotationTime}>{ann.time}</span>
                      <p>{ann.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Info */}
              <div className={styles.videoDetails}>
                <div className={styles.presenter}>
                  <div className={styles.presenterAvatar}>{selectedVideo.presenter[0]}</div>
                  <div>
                    <div className={styles.presenterName}>{selectedVideo.presenter}</div>
                    <div className={styles.presenterRole}>{selectedVideo.role}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <span>🎬</span>
              <h2>Select a video to watch</h2>
              <p>Choose from the library on the left</p>
            </div>
          )}
        </main>

        {/* Notes Sidebar */}
        <aside className={styles.notesSidebar}>
          <h3>My Notes</h3>
          <textarea 
            placeholder="Take notes while watching..."
            className={styles.notesInput}
          />
          <div className={styles.notesTips}>
            <h4>💡 Tips</h4>
            <ul>
              <li>Notes are auto-saved</li>
              <li>Click timestamps to jump</li>
              <li>Export to PDF later</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
