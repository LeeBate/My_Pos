export interface Product {
  _id?: string
  name: string
  price: number
  cost: number
  stock: number
  category: string
  barcode?: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  _id?: string
  name: string
  email?: string
  phone?: string
  address?: string
  totalPurchases: number
  createdAt: Date
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Sale {
  _id?: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: "cash" | "card" | "transfer"
  customerId?: string
  customerName?: string
  cashierId: string
  createdAt: Date
}

export interface User {
  _id?: string
  username: string
  email: string
  role: "admin" | "cashier"
  createdAt: Date
}
