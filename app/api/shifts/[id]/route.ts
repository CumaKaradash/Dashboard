import { NextRequest, NextResponse } from "next/server"
import { PsychologyDatabase } from "@/lib/psychology-database"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const shift = PsychologyDatabase.shifts.getById(params.id)
  if (!shift) return NextResponse.json({ error: "Vardiya bulunamadı" }, { status: 404 })
  return NextResponse.json(shift)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = PsychologyDatabase.shifts.update(params.id, data)
  if (!updated) return NextResponse.json({ error: "Güncellenemedi" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const deleted = PsychologyDatabase.shifts.delete(params.id)
  if (!deleted) return NextResponse.json({ error: "Silinemedi" }, { status: 404 })
  return NextResponse.json({ success: true })
} 