/**
 * Environment is read when these functions are called, not at import time,
 * because collections are imported before payload.config.ts runs dotenv.
 */
export function getS3Config() {
  return {
    bucket: process.env.S3_BUCKET || process.env.AWS_BUCKET,
    accessKeyId:
      process.env.S3_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      process.env.aws_access_key_id,
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.aws_secret_access_key,
    endpoint:
      process.env.S3_ENDPOINT ||
      process.env.ENDPOINT_URL ||
      process.env.endpoint_url,
    region:
      process.env.S3_REGION ||
      process.env.AWS_REGION ||
      process.env.region ||
      "ap-northeast-1",
  };
}

/** Public URL of a media file: in cloud storage if configured, otherwise served by Payload. */
export function getMediaFileURL({ filename, prefix }: { filename: string; prefix?: string | null }): string {
  const { bucket, accessKeyId, secretAccessKey, endpoint, region } = getS3Config();
  const fileKey = prefix ? `${prefix}/${filename}` : filename;

  if (!bucket || !accessKeyId || !secretAccessKey) {
    return `/api/media/file/${fileKey}`;
  }
  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL.replace(/\/+$/, "")}/${fileKey}`;
  }
  if (endpoint && endpoint.includes("storage.supabase.co")) {
    const projectRef = endpoint.match(/https?:\/\/([^.]+)\.storage\.supabase\.co/)?.[1];
    if (projectRef) {
      return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}/${fileKey}`;
    }
  }
  if (endpoint) {
    return `${endpoint.replace(/\/+$/, "")}/${bucket}/${fileKey}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;
}
