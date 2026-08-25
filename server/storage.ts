// Supabase Storage helpers.
// Uploads happen server-side using the secret key; downloads use the public URL.

const SUPABASE_URL = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "images";

function getConfig() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
      "Supabase storage credentials missing: set SUPABASE_URL and SUPABASE_SECRET_KEY"
    );
  }
  return { url: SUPABASE_URL, apiKey: SUPABASE_SECRET_KEY };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

export function publicUrl(key: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${normalizeKey(key)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { url, apiKey } = getConfig();
  const key = normalizeKey(relKey);

  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: data as unknown as BodyInit,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }

  return { key, url: publicUrl(key) };
}

export async function storageDelete(key: string): Promise<void> {
  const { url, apiKey } = getConfig();
  await fetch(`${url}/storage/v1/object/${BUCKET}/${normalizeKey(key)}`, {
    method: "DELETE",
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
}
