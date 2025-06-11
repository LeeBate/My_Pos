"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Search, Calendar, DollarSign, ShoppingCart, RefreshCw } from "lucide-react"
import type { Sale } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState("")
  const { toast } = useToast()
  const pathname = usePathname()

  useEffect(() => {
    fetchSales()
  }, [])

  useEffect(() => {
    filterSales()
  }, [sales, searchTerm, dateFilter])

  const fetchSales = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/sales")
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error("Failed to fetch sales:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการขายได้",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterSales = () => {
    let filtered = sales

    // Filter by search term (customer name or sale ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale._id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.createdAt)
        return (
          saleDate.getFullYear() === filterDate.getFullYear() &&
          saleDate.getMonth() === filterDate.getMonth() &&
          saleDate.getDate() === filterDate.getDate()
        )
      })
    }

    setFilteredSales(filtered)
  }

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      cash: "default",
      card: "secondary",
      transfer: "outline",
    } as const

    const labels = {
      cash: "เงินสด",
      card: "บัตร",
      transfer: "โอน",
    }

    return (
      <Badge variant={variants[method as keyof typeof variants] || "default"}>
        {labels[method as keyof typeof labels] || method}
      </Badge>
    )
  }

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = filteredSales.length

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">รายการการขาย</h1>
        <Button onClick={fetchSales} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          รีเฟรช
        </Button>
      </div>

      {/* เพิ่มหลังจาก header และก่อน Summary Cards */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <Link
            href="/sales"
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm",
              pathname === "/sales"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            รายการการขาย
          </Link>
          <Link
            href="/sales/analytics"
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm",
              pathname === "/sales/analytics"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            วิเคราะห์การขาย
          </Link>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายรวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนการขาย</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายเฉลี่ย</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาด้วยชื่อลูกค้าหรือรหัสการขาย..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setDateFilter("")
              }}
            >
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการการขาย ({filteredSales.length} รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัสการขาย</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>จำนวนสินค้า</TableHead>
                <TableHead>ยอดรวม</TableHead>
                <TableHead>วิธีชำระ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    ไม่พบข้อมูลการขาย
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell className="font-mono text-sm">{sale._id?.slice(-8).toUpperCase() || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{sale.customerName || "ลูกค้าทั่วไป"}</TableCell>
                    <TableCell>{sale.items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น</TableCell>
                    <TableCell className="font-bold">฿{sale.total.toFixed(2)}</TableCell>
                    <TableCell>{getPaymentMethodBadge(sale.paymentMethod)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedSale(sale)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>รายละเอียดการขาย</DialogTitle>
                          </DialogHeader>
                          {selectedSale && <SaleDetails sale={selectedSale} />}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Sale Details Component
function SaleDetails({ sale }: { sale: Sale }) {
  return (
    <div className="space-y-6">
      {/* Sale Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">ข้อมูลการขาย</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">รหัส:</span> {sale._id?.slice(-8).toUpperCase()}
            </p>
            <p>
              <span className="font-medium">วันที่:</span>{" "}
              {new Date(sale.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <span className="font-medium">ลูกค้า:</span> {sale.customerName || "ลูกค้าทั่วไป"}
            </p>
            <p>
              <span className="font-medium">วิธีชำระ:</span>{" "}
              {sale.paymentMethod === "cash" ? "เงินสด" : sale.paymentMethod === "card" ? "บัตร" : "โอน"}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">สรุปยอด</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">ยอดรวม:</span> ฿{sale.subtotal.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">ภาษี:</span> ฿{sale.tax.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">ส่วนลด:</span> ฿{sale.discount.toFixed(2)}
            </p>
            <p className="text-lg font-bold">
              <span className="font-medium">รวมทั้งสิ้น:</span> ฿{sale.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="font-semibold mb-2">รายการสินค้า</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>สินค้า</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>จำนวน</TableHead>
              <TableHead>รวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>฿{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>฿{item.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
