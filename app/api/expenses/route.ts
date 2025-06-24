import { NextResponse } from "next/server"
import { mockExpenses } from "@/lib/database"

export async function GET() {
  return NextResponse.json(mockExpenses)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newExpense = {
    id: String(mockExpenses.length + 1),
    ...body,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  }

  mockExpenses.push(newExpense)

  return NextResponse.json(newExpense, { status: 201 })
}
