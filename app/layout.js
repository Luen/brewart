import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'BrewArt Brewprints Brewing Recipes & Ingredients',
    description: 'Comparing all the brewprints and recipes for home brewing.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
