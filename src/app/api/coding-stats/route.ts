import { NextResponse } from "next/server";
import { getCodingStats } from "@/lib/coding-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const stats = await getCodingStats({ fresh: true });
  return NextResponse.json(
    {
      stats,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}
