import { NextResponse } from "next/server"
import { PsychologyDatabase } from "@/lib/psychology-database"

export async function GET() {
  return NextResponse.json(PsychologyDatabase.patients.getAll())
}

export async function POST(request: Request) {
  const body = await request.json()
  const newPatient = PsychologyDatabase.patients.create({
    ...body,
  })
  return NextResponse.json(newPatient, { status: 201 })
} 