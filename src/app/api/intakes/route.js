import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req) {
  const form = req.nextUrl.searchParams.get("form");
  const now = new Date().toISOString();
  const { data, error } = await s
    .from("intakes")
    .select("id, form, slug, title, opens_at, closes_at, is_open, config")
    .eq("form", form)
    .lte("opens_at", now)
    .or("closes_at.is.null,closes_at.gte." + now)
    .eq("is_open", true)
    .order("opens_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
