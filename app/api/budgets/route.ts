import { NextResponse } from "next/server"
import { FinanceDB } from "@/lib/finance-database"

export async function GET() {
  return NextResponse.json(FinanceDB.budgets.getAll())
}

export async function POST(request: Request) {
  const body = await request.json()
  const newBudget = FinanceDB.budgets.create({
    ...body,
  })
  return NextResponse.json(newBudget, { status: 201 })
} 