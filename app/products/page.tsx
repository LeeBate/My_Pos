"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Product } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    barcode: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        name: formData.name,
        price: Number.parseFloat(formData.price),
        cost: Number.parseFloat(formData.cost),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
        barcode: formData.barcode,
        description: formData.description,
      }

      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast({
          title: editingProduct ? "แก้ไขสำเร็จ" : "เพิ่มสำเร็จ",
          description: `สินค้า ${formData.name} ${editingProduct ? "แก้ไข" : "เพิ่ม"}สำเร็จ`,
        })

        setIsDialogOpen(false)
        setEditingProduct(null)
        setFormData({
          name: "",
          price: "",
          cost: "",
          stock: "",
          category: "",
          barcode: "",
          description: "",
        })
        fetchProducts()
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      category: product.category,
      barcode: product.barcode || "",
      description: product.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({
            title: "ลบสำเร็จ",
            description: "ลบสินค้าสำเร็จ",
          })
          fetchProducts()
        }
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบสินค้าได้",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProduct(null)
                setFormData({
                  name: "",
                  price: "",
                  cost: "",
                  stock: "",
                  category: "",
                  barcode: "",
                  description: "",
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้า
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อสินค้า</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">ราคาขาย</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cost">ราคาทุน</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">จำนวนสต็อก</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">หมวดหมู่</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="barcode">บาร์โค้ด</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">รายละเอียด</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
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
          <CardTitle>รายการสินค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>ราคาขาย</TableHead>
                <TableHead>ราคาทุน</TableHead>
                <TableHead>สต็อก</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>฿{product.price.toFixed(2)}</TableCell>
                  <TableCell>฿{product.cost.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock > 10 ? "พร้อมขาย" : product.stock > 0 ? "สต็อกต่ำ" : "หมดสต็อก"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id!)}>
                        <Trash2 className="w-4 h-4" />
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
