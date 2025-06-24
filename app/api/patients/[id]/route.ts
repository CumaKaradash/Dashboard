import { NextResponse } from "next/server"
import { PsychologyDatabase } from "@/lib/psychology-database"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = PsychologyDatabase.patients.delete(params.id)
  if (deleted) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, error: "Hasta bulunamadı" }, { status: 404 })
  }
} 