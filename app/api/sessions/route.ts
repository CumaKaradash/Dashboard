import { NextRequest, NextResponse } from "next/server"
import { PsychologyDatabase } from "@/lib/psychology-database"

export async function GET() {
  const sessions = PsychologyDatabase.sessions.getAll()
  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const created = PsychologyDatabase.sessions.create(data)
  return NextResponse.json(created)
} 