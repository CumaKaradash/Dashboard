import { NextRequest, NextResponse } from "next/server"
import { PsychologyDatabase } from "@/lib/psychology-database"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = PsychologyDatabase.sessions.getById(params.id)
  if (!session) return NextResponse.json({ error: "Seans bulunamadı" }, { status: 404 })
  return NextResponse.json(session)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = PsychologyDatabase.sessions.update(params.id, data)
  if (!updated) return NextResponse.json({ error: "Güncellenemedi" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const deleted = PsychologyDatabase.sessions.delete(params.id)
  if (!deleted) return NextResponse.json({ error: "Silinemedi" }, { status: 404 })
  return NextResponse.json({ success: true })
} 