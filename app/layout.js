import './globals.css'
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
  title: 'Excellere — AI Learning Platform',
  description: 'AI-Native Learning Platform for Business Leaders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
