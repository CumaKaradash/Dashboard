import { NextRequest, NextResponse } from "next/server"
import { DatabaseOperations } from "@/lib/database"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const product = DatabaseOperations.products.getById(params.id)
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = DatabaseOperations.products.update(params.id, data)
  if (!updated) return NextResponse.json({ error: "Güncellenemedi" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const deleted = DatabaseOperations.products.delete(params.id)
  if (!deleted) return NextResponse.json({ error: "Silinemedi" }, { status: 404 })
  return NextResponse.json({ success: true })
} 