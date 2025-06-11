import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from || !to) {
      return NextResponse.json({ error: "Date range is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.POS_APP_DB)

    // แก้ไขการจัดการวันที่ให้ครอบคลุมทั้งวันอย่างถูกต้อง
    const fromDate = new Date(from)
    fromDate.setHours(0, 0, 0, 0) // เริ่มต้นวันที่ 00:00:00.000

    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999) // สิ้นสุดวันที่ 23:59:59.999

    console.log(`Fetching sales from ${fromDate.toISOString()} to ${toDate.toISOString()}`)

    // Get sales in date range
    const sales = await db
      .collection("sales")
      .find({
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      })
      .toArray()

    console.log(`Found ${sales.length} sales records`)

    // Calculate analytics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTransactions = sales.length
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    // Top products
    const productStats = new Map()
    sales.forEach((sale) => {
      sale.items.forEach((item: { productName: any; quantity: any; total: any }) => {
        const existing = productStats.get(item.productName) || { quantity: 0, revenue: 0 }
        productStats.set(item.productName, {
          productName: item.productName,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.total,
        })
      })
    })

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Payment methods
    const paymentStats = new Map()
    sales.forEach((sale) => {
      const existing = paymentStats.get(sale.paymentMethod) || { count: 0, revenue: 0 }
      paymentStats.set(sale.paymentMethod, {
        method: sale.paymentMethod,
        count: existing.count + 1,
        revenue: existing.revenue + sale.total,
      })
    })

    const paymentMethods = Array.from(paymentStats.values())

    // Daily sales
    const dailyStats = new Map()
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt).toISOString().split("T")[0]
      const existing = dailyStats.get(date) || { revenue: 0, transactions: 0 }
      dailyStats.set(date, {
        date,
        revenue: existing.revenue + sale.total,
        transactions: existing.transactions + 1,
      })
    })

    const dailySales = Array.from(dailyStats.values()).sort((a, b) => a.date.localeCompare(b.date))

    const analytics = {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      topProducts,
      dailySales,
      paymentMethods,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
