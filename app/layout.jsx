import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "./components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Zip Link',
  description: 'Short Url Generator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}<Toaster /></body>
    </html>
  )
}
