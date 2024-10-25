import { NextResponse } from 'next/server'
import { getBrewprints } from '@/lib/brewprints'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 604800

export async function GET(req, res) {
    try {
        const brewprints = await getBrewprints()
        return NextResponse.json(brewprints)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Error fetching data' })
    }
}
