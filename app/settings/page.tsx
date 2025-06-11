"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Store, Receipt, Users, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">ตั้งค่าระบบ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="w-5 h-5 mr-2" />
              ข้อมูลร้านค้า
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">ชื่อร้าน</Label>
              <Input id="storeName" placeholder="ชื่อร้านค้า" />
            </div>
            <div>
              <Label htmlFor="storeAddress">ที่อยู่</Label>
              <Input id="storeAddress" placeholder="ที่อยู่ร้านค้า" />
            </div>
            <div>
              <Label htmlFor="storePhone">เบอร์โทร</Label>
              <Input id="storePhone" placeholder="เบอร์โทรศัพท์" />
            </div>
            <div>
              <Label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี</Label>
              <Input id="taxId" placeholder="Tax ID" />
            </div>
            <Button>บันทึกข้อมูลร้าน</Button>
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              การตั้งค่าใบเสร็จ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoPrint">พิมพ์ใบเสร็จอัตโนมัติ</Label>
              <Switch id="autoPrint" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showTax">แสดงภาษีในใบเสร็จ</Label>
              <Switch id="showTax" defaultChecked />
            </div>
            <div>
              <Label htmlFor="receiptFooter">ข้อความท้ายใบเสร็จ</Label>
              <Input id="receiptFooter" placeholder="ขอบคุณที่ใช้บริการ" />
            </div>
            <Button>บันทึกการตั้งค่า</Button>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              การตั้งค่าภาษี
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="taxRate">อัตราภาษี (%)</Label>
              <Input id="taxRate" type="number" step="0.01" defaultValue="7" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="includeTax">รวมภาษีในราคา</Label>
              <Switch id="includeTax" />
            </div>
            <Button>บันทึกการตั้งค่า</Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              จัดการผู้ใช้
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newUser">เพิ่มผู้ใช้ใหม่</Label>
              <Input id="newUser" placeholder="ชื่อผู้ใช้" />
            </div>
            <div>
              <Label htmlFor="userRole">บทบาท</Label>
              <select className="w-full p-2 border rounded">
                <option value="cashier">พนักงานขาย</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>
            <Button>เพิ่มผู้ใช้</Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Database Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            จัดการฐานข้อมูล
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">สำรองข้อมูล</Button>
            <Button variant="outline">นำเข้าข้อมูล</Button>
            <Button variant="destructive">ล้างข้อมูลการขาย</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
