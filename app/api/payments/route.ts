import { NextResponse } from "next/server"
import { FinanceDB } from "@/lib/finance-database"

export async function GET() {
  return NextResponse.json(FinanceDB.payments.getAll())
}

export async function POST(request: Request) {
  const body = await request.json()
  const newPayment = FinanceDB.payments.create({
    ...body,
  })
  return NextResponse.json(newPayment, { status: 201 })
} 