"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, TrendingUp, BarChart3 } from "lucide-react"

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = []

    if (segments.includes("sales")) {
      breadcrumbs.push({
        name: "การขาย",
        href: "/sales",
        icon: TrendingUp,
      })

      if (segments.includes("analytics")) {
        breadcrumbs.push({
          name: "วิเคราะห์การขาย",
          href: "/sales/analytics",
          icon: BarChart3,
        })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <div className="bg-gray-50 border-b px-6 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              หน้าหลัก
            </Link>
            {breadcrumbs.map((crumb, index) => {
              const Icon = crumb.icon
              const isLast = index === breadcrumbs.length - 1

              return (
                <div key={crumb.href} className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  {isLast ? (
                    <span className="flex items-center text-gray-900 font-medium">
                      <Icon className="w-4 h-4 mr-1" />
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="flex items-center text-gray-500 hover:text-gray-700">
                      <Icon className="w-4 h-4 mr-1" />
                      {crumb.name}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  )
}
