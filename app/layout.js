import './globals.css'
import { UserProvider } from '../context/UserContext'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'

const dmSerif = DM_Serif_Display({ 
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-serif'
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata = {
  title: 'Excellere — AI-Native Learning for Leaders',
  description: 'Personalized AI education for senior business leaders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
