import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Prevent Next.js from caching this route so every hit reaches the database.
export const dynamic = "force-dynamic";

// Hit by Vercel Cron (see vercel.json) to generate periodic database activity
// so the Supabase project doesn't pause for inactivity.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (error) {
    console.error("keep-alive failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
