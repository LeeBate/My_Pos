"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingCart, Package, Users, TrendingUp, Settings, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS", href: "/pos", icon: ShoppingCart },
  { name: "สินค้า", href: "/products", icon: Package },
  { name: "ลูกค้า", href: "/customers", icon: Users },
  {
    name: "การขาย",
    href: "/sales",
    icon: TrendingUp,
    subItems: [
      { name: "รายการการขาย", href: "/sales" },
      { name: "วิเคราะห์การขาย", href: "/sales/analytics" },
    ],
  },
  { name: "ตั้งค่า", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">POS System</h1>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedItems.includes(item.name)
            const hasSubItems = item.subItems && item.subItems.length > 0

            return (
              <li key={item.name}>
                <div>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg transition-colors",
                      pathname === item.href || (hasSubItems && item.subItems?.some((sub) => pathname === sub.href))
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    )}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault()
                        toggleExpanded(item.name)
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {hasSubItems && (
                      <ChevronDown
                        className={cn("w-4 h-4 ml-auto transition-transform", isExpanded ? "rotate-180" : "")}
                      />
                    )}
                  </Link>

                  {hasSubItems && isExpanded && (
                    <ul className="mt-2 ml-8 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block px-4 py-2 rounded-lg transition-colors text-sm",
                              pathname === subItem.href
                                ? "bg-blue-500 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            )}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  )
}
