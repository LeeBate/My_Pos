"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, TrendingUp, Package, DollarSign } from "lucide-react"
import type { Sale } from "@/types"

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])

  useEffect(() => {
    fetchSales()
    // Set default dates (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    setDateFrom(thirtyDaysAgo.toISOString().split("T")[0])
    setDateTo(today.toISOString().split("T")[0])
  }, [])

  useEffect(() => {
    filterSales()
  }, [sales, dateFrom, dateTo])

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales")
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error("Failed to fetch sales:", error)
    }
  }

  const filterSales = () => {
    if (!dateFrom || !dateTo) {
      setFilteredSales(sales)
      return
    }

    const fromDate = new Date(dateFrom)
    const toDate = new Date(dateTo)
    toDate.setHours(23, 59, 59, 999) // Include the entire end date

    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= fromDate && saleDate <= toDate
    })

    setFilteredSales(filtered)
  }

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = filteredSales.length
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
  const totalItems = filteredSales.reduce(
    (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">รายงานการขาย</h1>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>เลือกช่วงวันที่</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="dateFrom">วันที่เริ่มต้น</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="dateTo">วันที่สิ้นสุด</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <Button onClick={filterSales}>
              <CalendarDays className="w-4 h-4 mr-2" />
              ค้นหา
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนการขาย</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายเฉลี่ย</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{averageTransaction.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้าที่ขาย</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการการขาย</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>จำนวนสินค้า</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>ภาษี</TableHead>
                <TableHead>รวมทั้งสิ้น</TableHead>
                <TableHead>วิธีชำระ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                  <TableCell>฿{sale.subtotal.toFixed(2)}</TableCell>
                  <TableCell>฿{sale.tax.toFixed(2)}</TableCell>
                  <TableCell className="font-bold">฿{sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        sale.paymentMethod === "cash"
                          ? "bg-green-100 text-green-800"
                          : sale.paymentMethod === "card"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {sale.paymentMethod === "cash" ? "เงินสด" : sale.paymentMethod === "card" ? "บัตร" : "โอน"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
