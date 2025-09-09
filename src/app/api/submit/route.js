import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = process.env.SUPABASE_BUCKET || "upisi";
const MAX = 16 * 1024 * 1024;

function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");
}
function validOIB(o) {
  if (!/^\d{11}$/.test(o || "")) return false;
  let b = 10;
  for (let i = 0; i < 10; i++) {
    b = (b + parseInt(o[i], 10)) % 10;
    if (b === 0) b = 10;
    b = (b * 2) % 11;
  }
  return (11 - b) % 10 === parseInt(o[10], 10);
}
function bad(msg, code = 400) {
  return NextResponse.json({ error: msg }, { status: code });
}
const buf = (f) => Buffer.from(new Uint8Array(f));

export async function POST(req) {
  try {
    const fd = await req.formData();
    const intake_id = fd.get("intake_id");
    const form = fd.get("form");
    const oib = (fd.get("oib") || "").trim();
    const email = (fd.get("email") || "").trim();
    const now = new Date().toISOString();
    if (!intake_id) return bad("Upisi nisu otvoreni.");
    const { data: intake } = await supa.from("intakes").select("id,is_open,opens_at,closes_at,config,form").eq("id", intake_id).single();
    if (!intake || !intake.is_open || (intake.opens_at && intake.opens_at > now) || (intake.closes_at && intake.closes_at < now)) return bad("Upisi zatvoreni.");
    if (intake.form !== form) return bad("Nevažeći obrazac.");
    if (!validOIB(oib)) return bad("Neispravan OIB.");
    if (!validEmail(email)) return bad("Neispravan e-mail.");
    if (fd.get("privola") !== "true") return bad("Potrebna je privola.");

    const { data: existing } = await supa.from("applications").select("id, app_status, photo_path, signature_path").eq("intake_id", intake_id).eq("oib", oib).maybeSingle();

    if (existing && ["under_review", "accepted", "rejected", "locked"].includes(existing.app_status)) return bad("Prijava je zaključana.", 409);

    const id = existing?.id || crypto.randomUUID();

    const row = {
      id,
      intake_id,
      form,
      program: fd.get("program"),
      study_status: fd.get("status"),
      spol: fd.get("spol"),
      ime: fd.get("ime"),
      prezime: fd.get("prezime"),
      datum_rodjenja: fd.get("datum_rodjenja"),
      oib,
      mjesto_rodjenja: fd.get("mjesto_rodjenja"),
      drzava_rodjenja: fd.get("drzava_rodjenja"),
      adresa: fd.get("adresa"),
      bracno_stanje: fd.get("bracno_stanje"),
      drzavljanstvo: fd.get("drzavljanstvo"),
      email,
      mobitel: fd.get("mobitel"),
      zavrsen_preddiplomski: fd.get("zavrsen_preddiplomski"),
      ime_oca: fd.get("ime_oca"),
      zanimanje_oca: fd.get("zanimanje_oca"),
      adresa_oca: fd.get("adresa_oca"),
      ime_majke: fd.get("ime_majke"),
      zanimanje_majke: fd.get("zanimanje_majke"),
      adresa_majke: fd.get("adresa_majke"),
      privola: true,
    };

    if (existing) {
      const { error } = await supa.from("applications").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supa.from("applications").insert(row);
      if (error) throw error;
    }

    const upfile = async (file, name) => {
      if (!file || !file.name) return null;
      if (file.size > MAX) throw new Error("Datoteka je prevelika.");
      const ok = ["image/jpeg", "image/png"].includes(file.type);
      if (!ok) throw new Error("Nepodržan tip datoteke.");
      const ext = file.name.split(".").pop().toLowerCase();
      const path = `applications/${id}/${name}.${ext}`;
      const { error } = await supa.storage.from(BUCKET).upload(path, buf(await file.arrayBuffer()), { contentType: file.type, upsert: true });
      if (error) throw error;
      return path;
    };

    const photo = fd.get("photo");
    const sign = fd.get("signature");
    const photo_path = intake.config?.requires_files ? await upfile(photo, "photo") : await upfile(photo, "photo");
    const signature_path = intake.config?.requires_files ? await upfile(sign, "signature") : await upfile(sign, "signature");

    if (intake.config?.requires_files && (!photo_path || !signature_path)) return bad("Nedostaju datoteke.");

    if (photo_path || signature_path) {
      const patch = {};
      if (photo_path) patch.photo_path = photo_path;
      if (signature_path) patch.signature_path = signature_path;
      await supa.from("applications").update(patch).eq("id", id);
    }

    return NextResponse.json({ id, replaced: !!existing });
  } catch (e) {
    return bad(e.message || "Greška", 400);
  }
}
