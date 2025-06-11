"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalSales: number
  todaySales: number
  totalProducts: number
  lowStockProducts: number
  totalCustomers: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    todaySales: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/pos">
            <Button className="bg-green-600 hover:bg-green-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              เริ่มขาย
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายวันนี้</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{stats.todaySales.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายรวม</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{stats.totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนสินค้า</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            {stats.lowStockProducts > 0 && (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                สต็อกต่ำ {stats.lowStockProducts} รายการ
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้า</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link href="/products">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                จัดการสินค้า
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">เพิ่ม แก้ไข และจัดการสินค้าในระบบ</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link href="/sales">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                รายงานการขาย
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">ดูรายงานและสถิติการขาย</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link href="/customers">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                จัดการลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">จัดการข้อมูลลูกค้าและประวัติการซื้อ</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
