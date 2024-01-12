import { NextResponse } from 'next/server';
import { getIngredients } from '@/lib/ingredients'

export async function GET(req, res) {
  try {
    const products = await getIngredients();
    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching data" });
  }
}
