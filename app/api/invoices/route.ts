import { NextResponse } from "next/server"
import { FinanceDB } from "@/lib/finance-database"

export async function GET() {
  return NextResponse.json(FinanceDB.invoices.getAll())
}

export async function POST(request: Request) {
  const body = await request.json()
  const newInvoice = FinanceDB.invoices.create({
    ...body,
  })
  return NextResponse.json(newInvoice, { status: 201 })
} 