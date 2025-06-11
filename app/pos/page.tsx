"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Package } from "lucide-react"
import type { Product, SaleItem } from "@/types"
import { useToast } from "@/hooks/use-toast"

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<SaleItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product._id)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
              : item,
          ),
        )
      } else {
        toast({
          title: "สต็อกไม่เพียงพอ",
          description: `สินค้า ${product.name} มีสต็อกเหลือ ${product.stock} ชิ้น`,
          variant: "destructive",
        })
      }
    } else {
      if (product.stock > 0) {
        const newItem: SaleItem = {
          productId: product._id!,
          productName: product.name,
          quantity: 1,
          price: product.price,
          total: product.price,
        }
        setCart([...cart, newItem])
      } else {
        toast({
          title: "สินค้าหมด",
          description: `สินค้า ${product.name} หมดสต็อก`,
          variant: "destructive",
        })
      }
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p._id === productId)
    if (product && newQuantity <= product.stock) {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
        ),
      )
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.07 // 7% VAT
  const total = subtotal + tax

  const processSale = async (paymentMethod: "cash" | "card" | "transfer") => {
    if (cart.length === 0) {
      toast({
        title: "ตะกร้าว่าง",
        description: "กรุณาเพิ่มสินค้าในตะกร้าก่อนชำระเงิน",
        variant: "destructive",
      })
      return
    }

    try {
      const saleData = {
        items: cart,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod,
        cashierId: "current-user-id", // Replace with actual user ID
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })

      if (response.ok) {
        toast({
          title: "ขายสำเร็จ",
          description: `ยอดขาย ฿${total.toFixed(2)}`,
        })
        setCart([])
        fetchProducts() // Refresh products to update stock
      } else {
        throw new Error("Failed to process sale")
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการขายได้",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen">
      {/* Products Section */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "ทั้งหมด" : category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-lg font-bold text-green-600">฿{product.price}</p>
                <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                  สต็อก: {product.stock}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 border-l bg-gray-50 p-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>ตะกร้าสินค้า</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">ไม่มีสินค้าในตะกร้า</p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          ฿{item.price} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.productId)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>ยอดรวม:</span>
                    <span>฿{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ภาษี (7%):</span>
                    <span>฿{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>รวมทั้งสิ้น:</span>
                    <span>฿{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button onClick={() => processSale("cash")} className="flex flex-col gap-1 h-16">
                    <Banknote className="w-4 h-4" />
                    <span className="text-xs">เงินสด</span>
                  </Button>
                  <Button onClick={() => processSale("card")} className="flex flex-col gap-1 h-16">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">บัตร</span>
                  </Button>
                  <Button onClick={() => processSale("transfer")} className="flex flex-col gap-1 h-16">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-xs">โอน</span>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
