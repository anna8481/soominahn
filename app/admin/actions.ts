"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  COOKIE_NAME,
  MAX_AGE_SECONDS,
  createSessionToken,
} from "@/lib/auth";
import { getAdminClient, ARTWORK_BUCKET } from "@/lib/supabase/admin";
import type { CVSection } from "@/lib/types";

type ActionState = { error?: string } | null;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!adminPassword || !secret) {
    return { error: "Server not configured (ADMIN_PASSWORD / AUTH_SECRET)" };
  }
  if (password !== adminPassword) {
    return { error: "Wrong password" };
  }
  const token = await createSessionToken(secret);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Artworks
// ---------------------------------------------------------------------------

async function uploadImageIfAny(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = getAdminClient();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(ARTWORK_BUCKET)
    .upload(key, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(ARTWORK_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

function readArtworkFields(formData: FormData) {
  const year = Number(formData.get("year"));
  const title = String(formData.get("title") ?? "").trim();
  const statement =
    String(formData.get("statement") ?? "").trim() || null;
  const medium = String(formData.get("medium") ?? "").trim() || null;
  const dimensions =
    String(formData.get("dimensions") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const display_order = Number(formData.get("display_order") || 0);
  if (!Number.isFinite(year) || year < 1900 || year > 2100) {
    throw new Error("Year must be a valid number");
  }
  if (!title) throw new Error("Title is required");
  return {
    year,
    title,
    statement,
    medium,
    dimensions,
    featured,
    display_order,
  };
}

export async function createArtworkAction(formData: FormData) {
  const fields = readArtworkFields(formData);
  const file = formData.get("image") as File | null;
  const image_url = await uploadImageIfAny(file);
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("artworks")
    .insert({ ...fields, image_url });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/artworks");
  redirect("/admin/artworks");
}

export async function updateArtworkAction(id: string, formData: FormData) {
  const fields = readArtworkFields(formData);
  const file = formData.get("image") as File | null;
  const supabase = getAdminClient();

  const patch: Record<string, unknown> = { ...fields };
  const new_url = await uploadImageIfAny(file);
  if (new_url) patch.image_url = new_url;

  const { error } = await supabase
    .from("artworks")
    .update(patch)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/artworks");
  redirect("/admin/artworks");
}

export async function deleteArtworkAction(id: string) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin/artworks");
}

// ---------------------------------------------------------------------------
// CV entries
// ---------------------------------------------------------------------------

function readCVFields(formData: FormData) {
  const section = String(formData.get("section") ?? "") as CVSection;
  const allowed: CVSection[] = [
    "contact",
    "education",
    "solo",
    "group",
    "interview",
  ];
  if (!allowed.includes(section)) throw new Error("Invalid section");

  const yearRaw = String(formData.get("year") ?? "").trim();
  const year = yearRaw === "" ? null : Number(yearRaw);
  if (year !== null && !Number.isFinite(year)) {
    throw new Error("Year must be a number");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required");

  const link = String(formData.get("link") ?? "").trim() || null;
  const display_order = Number(formData.get("display_order") || 0);
  return { section, year, title, link, display_order };
}

export async function createCVEntryAction(formData: FormData) {
  const fields = readCVFields(formData);
  const supabase = getAdminClient();
  const { error } = await supabase.from("cv_entries").insert(fields);
  if (error) throw new Error(error.message);
  revalidatePath("/cv");
  revalidatePath("/admin/cv");
  redirect("/admin/cv");
}

export async function updateCVEntryAction(id: string, formData: FormData) {
  const fields = readCVFields(formData);
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("cv_entries")
    .update(fields)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/cv");
  revalidatePath("/admin/cv");
  redirect("/admin/cv");
}

export async function deleteCVEntryAction(id: string) {
  const supabase = getAdminClient();
  const { error } = await supabase.from("cv_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/cv");
  revalidatePath("/admin/cv");
}
