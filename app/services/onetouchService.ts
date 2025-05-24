// services/onetouchService.ts
import { getApiUrl } from "@/lib/config";
import { OneTouch } from "@/types/onetouch";

export async function getOneTouchFromApi(): Promise<OneTouch[]> {
  const url = getApiUrl("/api/get-onetouch");
  const res = await fetch(url, { cache: "no-store" });
// console.log("res",res)
  if (!res.ok) throw new Error("Failed to fetch OneTouch data");

  return res.json();
}
