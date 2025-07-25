import { NextRequest, NextResponse } from "next/server";
// Vercel Blob SDK
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  // Blobストレージにアップロード
  const blob = await put(file.name, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
