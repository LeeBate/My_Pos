import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Sale } from "@/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)
    const sales = await db.collection<Sale>("sales").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(sales)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)
    const body = await request.json()

    const sale: Omit<Sale, "_id"> = {
      ...body,
      createdAt: new Date(),
    }

    // Update product stock
    for (const item of sale.items) {
      await db.collection("products").updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } })
    }

    const result = await db.collection("sales").insertOne(sale)

    return NextResponse.json({ _id: result.insertedId, ...sale })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
