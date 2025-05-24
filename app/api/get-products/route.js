// app/api/get-product/route.js
import clientPromise from '@/lib/mongodb'; // ถ้าใช้ alias @ จาก tsconfig

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pos-app');
    const products = await db.collection('products').find({}).toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }), {
      status: 500,
    });
  }
}
