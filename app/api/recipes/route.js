import { NextResponse } from 'next/server';

export const dynamic = 'force-static'
export const revalidate = 604800
export const dynamicParams = false

export async function GET(req, res) {
  try {
    const recipes = require('@/lib/recipesClones.json');

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching data" });
  }
}
