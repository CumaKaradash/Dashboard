import { NextResponse } from "next/server"
import { mockAppointments } from "@/lib/database"

export async function GET() {
  return NextResponse.json(mockAppointments)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newAppointment = {
    id: String(mockAppointments.length + 1),
    ...body,
    status: "pending",
  }

  mockAppointments.push(newAppointment)

  return NextResponse.json(newAppointment, { status: 201 })
}
