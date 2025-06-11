import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)

    const sale = await db.collection("sales").findOne({
      _id: new ObjectId(params.id),
    })

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Failed to fetch sale:", error)
    return NextResponse.json({ error: "Failed to fetch sale" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)

    // Get sale details first to restore stock
    const sale = await db.collection("sales").findOne({
      _id: new ObjectId(params.id),
    })

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    // Restore product stock
    for (const item of sale.items) {
      await db
        .collection("products")
        .updateOne({ _id: new ObjectId(item.productId) }, { $inc: { stock: item.quantity } })
    }

    // Delete the sale
    const result = await db.collection("sales").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete sale" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Sale cancelled and stock restored" })
  } catch (error) {
    console.error("Failed to cancel sale:", error)
    return NextResponse.json({ error: "Failed to cancel sale" }, { status: 500 })
  }
}
