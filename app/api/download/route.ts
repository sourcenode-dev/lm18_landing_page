import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Streams the APK from Cloudflare R2 by redirecting to a short-lived,
 * presigned URL that forces a browser download. All R2 settings come from
 * environment variables — nothing account- or bucket-specific is committed.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID (or R2_ENDPOINT)
 *   R2_BUCKET_NAME
 *   R2_OBJECT_KEY
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 */
export async function GET() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  const key = process.env.R2_OBJECT_KEY;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint =
    process.env.R2_ENDPOINT ??
    (accountId
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : undefined);

  const missing = [
    !endpoint && "R2_ENDPOINT or R2_ACCOUNT_ID",
    !bucket && "R2_BUCKET_NAME",
    !key && "R2_OBJECT_KEY",
    !accessKeyId && "R2_ACCESS_KEY_ID",
    !secretAccessKey && "R2_SECRET_ACCESS_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `R2 is not configured. Missing: ${missing.join(", ")}` },
      { status: 500 },
    );
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });

  const filename = key!.split("/").pop() || "download.apk";

  const command = new GetObjectCommand({
    Bucket: bucket!,
    Key: key!,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.redirect(url, 302);
}
