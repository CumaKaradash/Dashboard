import { NextResponse } from "next/server"
import { FinanceDB } from "@/lib/finance-database"

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = FinanceDB.budgets.delete(params.id)
  if (deleted) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, error: "Bütçe bulunamadı" }, { status: 404 })
  }
} 