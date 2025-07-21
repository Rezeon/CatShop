import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as Blob;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (err, result) => {
    if (err || !result) {
      console.error(err);
      return;
    }
  });

  const readable = Readable.from(buffer);
  readable.pipe(stream);

  return new Promise((resolve) => {
    cloudinary.uploader.upload_stream({ folder: "products" }, (err, result) => {
      if (err || !result) {
        console.error(err);
        resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ secure_url: result.secure_url }));
      }
    }).end(buffer);
  });
}
