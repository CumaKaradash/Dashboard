import { NextResponse } from "next/server"
import { mockProducts } from "@/lib/database"

export async function GET() {
  return NextResponse.json(mockProducts)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newProduct = {
    id: String(mockProducts.length + 1),
    ...body,
    lastUpdated: new Date().toISOString().split("T")[0],
    status: body.stock <= body.minStock ? (body.stock === 0 ? "out" : "low") : "normal",
  }

  mockProducts.push(newProduct)

  return NextResponse.json(newProduct, { status: 201 })
}
