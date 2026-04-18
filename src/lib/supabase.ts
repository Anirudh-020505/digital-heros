// src/lib/supabase.ts - Supabase client and utilities

import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
}

// Client-side Supabase client (safe to expose anon key)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Server-side Supabase client (uses service role key)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * Upload winner verification proof to Supabase Storage
 */
export async function uploadWinnerProof(
  userId: string,
  file: File
): Promise<string> {
  const fileName = `${userId}-${Date.now()}-${file.name}`;
  const { error, data } = await supabase.storage
    .from("winner-proofs")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("winner-proofs").getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete winner proof from storage
 */
export async function deleteWinnerProof(publicUrl: string): Promise<void> {
  // Extract file path from public URL
  const fileName = publicUrl.split("/").pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from("winner-proofs")
    .remove([fileName]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Get public URL for a file in winner-proofs bucket
 */
export function getWinnerProofUrl(fileName: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from("winner-proofs").getPublicUrl(fileName);
  return publicUrl;
}
