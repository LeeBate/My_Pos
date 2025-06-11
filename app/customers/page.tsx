"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, User } from "lucide-react"
import type { Customer } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer._id}` : "/api/customers"
      const method = editingCustomer ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: editingCustomer ? "แก้ไขสำเร็จ" : "เพิ่มสำเร็จ",
          description: `ลูกค้า ${formData.name} ${editingCustomer ? "แก้ไข" : "เพิ่ม"}สำเร็จ`,
        })

        setIsDialogOpen(false)
        setEditingCustomer(null)
        setFormData({ name: "", email: "", phone: "", address: "" })
        fetchCustomers()
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการลูกค้า</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCustomer(null)
                setFormData({ name: "", email: "", phone: "", address: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มลูกค้า
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "แก้ไขลูกค้า" : "เพิ่มลูกค้าใหม่"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อลูกค้า</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">เบอร์โทร</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">ที่อยู่</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingCustomer ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการลูกค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อลูกค้า</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead>ยอดซื้อรวม</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell>฿{customer.totalPurchases.toFixed(2)}</TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleDateString("th-TH")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
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
