"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Package,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/format-helper";

interface SalesAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  topProducts: Array<{
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  dailySales: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;
}

export default function SalesAnalyticsPage() {
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date();

    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateFrom(formatDate(thirtyDaysAgo));
    setDateTo(formatDate(today));
  }, []);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchAnalytics();
    }
  }, [dateFrom, dateTo]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/sales/analytics?from=${dateFrom}&to=${dateTo}`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">วิเคราะห์การขาย</h1>

      {/* เพิ่มหลังจาก h1 และก่อน Date Filter */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <Link
            href="/sales"
            className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
          >
            รายการการขาย
          </Link>
          <Link
            href="/sales/analytics"
            className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
          >
            วิเคราะห์การขาย
          </Link>
        </nav>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>เลือกช่วงวันที่</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="dateFrom">วันที่เริ่มต้น</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">วันที่สิ้นสุด</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button onClick={fetchAnalytics}>
              <Calendar className="w-4 h-4 mr-2" />
              อัพเดท
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
            <div className="text-2xl font-bold">
              ฿{analytics?.totalRevenue?.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนการขาย</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalTransactions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายเฉลี่ย</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{analytics?.averageTransaction?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้าขายดี</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.topProducts?.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>สินค้าขายดี Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topProducts?.slice(0, 10)?.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      ขายได้ {product.quantity} ชิ้น
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">฿{product?.revenue?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>วิธีการชำระเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.paymentMethods?.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {method.method === "cash"
                        ? "เงินสด"
                        : method.method === "card"
                        ? "บัตร"
                        : "โอน"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {method.count} รายการ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">฿{method.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {(
                        (method.revenue / analytics.totalRevenue) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
