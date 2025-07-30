import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files");
  const uploadedUrls: string[] = [];
  for (const file of files) {
    if (file instanceof File) {
      const { upload } = await import("@vercel/blob/client");
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "",
      });
      uploadedUrls.push(url);
    }
  }
  return NextResponse.json({ urls: uploadedUrls });
}
