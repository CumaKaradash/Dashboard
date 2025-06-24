import { NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"

export async function GET() {
  const products = DatabaseOperations.products.getAll()
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const created = DatabaseOperations.products.create(data)
  return NextResponse.json(created)
}
