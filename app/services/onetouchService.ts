// services/onetouchService.ts
import { OneTouch } from '@/types/onetouch';

export async function getOneTouchFromApi(): Promise<OneTouch[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-onetouch`, {
    next: { revalidate: 300 }, // ✅ Cache 60 วินาที, ลด fast refresh
  });

  if (!res.ok) throw new Error("Failed to fetch OneTouch data");
  return res.json();
}