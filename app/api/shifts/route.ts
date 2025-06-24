import { NextRequest, NextResponse } from "next/server"
import { PsychologyDatabase } from "@/lib/psychology-database"

export async function GET() {
  const shifts = PsychologyDatabase.shifts.getAll()
  return NextResponse.json(shifts)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const created = PsychologyDatabase.shifts.create(data)
  return NextResponse.json(created)
} 