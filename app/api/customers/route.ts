import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Customer } from "@/types"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)
    const customers = await db.collection<Customer>("customers").find({}).toArray()

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)
    const body = await request.json()

    const customer: Omit<Customer, "_id"> = {
      ...body,
      totalPurchases: 0,
      createdAt: new Date(),
    }

    const result = await db.collection("customers").insertOne(customer)

    return NextResponse.json({ _id: result.insertedId, ...customer })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
