import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

dotenv.config({ path: path.resolve(dirname, "../.env") });

import sharp from "sharp";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Banners } from "./collections/Banners";
import { Enquiries } from "./collections/Enquiries";
import { Testimonials } from "./collections/Testimonials";
import { Offers } from "./collections/Offers";
import { BrandLogos } from "./collections/BrandLogos";

import { SiteSettings } from "./globals/SiteSettings";
import { HomepageSettings } from "./globals/HomepageSettings";
import { WhatsAppSettings } from "./globals/WhatsAppSettings";

const s3Bucket = process.env.S3_BUCKET || process.env.AWS_BUCKET;
const s3AccessKeyId =
  process.env.S3_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY_ID ||
  process.env.aws_access_key_id;
const s3SecretAccessKey =
  process.env.S3_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  process.env.aws_secret_access_key;
const s3Endpoint =
  process.env.S3_ENDPOINT ||
  process.env.ENDPOINT_URL ||
  process.env.endpoint_url;
const s3Region =
  process.env.S3_REGION ||
  process.env.AWS_REGION ||
  process.env.region ||
  "ap-northeast-1";

const plugins = [];

if (s3Bucket && s3AccessKeyId && s3SecretAccessKey) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            const fileKey = prefix ? `${prefix}/${filename}` : filename;
            if (process.env.S3_PUBLIC_URL) {
              return `${process.env.S3_PUBLIC_URL.replace(/\/+$/, "")}/${fileKey}`;
            }
            if (s3Endpoint && s3Endpoint.includes("storage.supabase.co")) {
              const projectRef = s3Endpoint.match(/https?:\/\/([^.]+)\.storage\.supabase\.co/)?.[1];
              if (projectRef) {
                return `https://${projectRef}.supabase.co/storage/v1/object/public/${s3Bucket}/${fileKey}`;
              }
            }
            if (s3Endpoint) {
              return `${s3Endpoint.replace(/\/+$/, "")}/${s3Bucket}/${fileKey}`;
            }
            return `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${fileKey}`;
          },
        },
      },
      bucket: s3Bucket,
      config: {
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        region: s3Region,
        ...(s3Endpoint
          ? {
              endpoint: s3Endpoint,
              forcePathStyle: true,
            }
          : {}),
      },
    })
  );
}

export default buildConfig({
  sharp,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Prime Vessels Admin",
      icons: [
        {
          rel: "icon",
          type: "image/x-icon",
          url: "/favicon.ico",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          url: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          url: "/favicon-16x16.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          url: "/apple-touch-icon.png",
        },
      ],
    },
    components: {
      graphics: {
        Logo: "/components/Logo#Logo",
        Icon: "/components/Icon#Icon",
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Banners, Enquiries, Testimonials, Offers, BrandLogos],
  globals: [SiteSettings, HomepageSettings, WhatsAppSettings],
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || "https://primevessellbackend.vercel.app",
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "https://primevessellbackend.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://primevessels.com",
    "https://www.primevessels.com",
  ],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || "https://primevessellbackend.vercel.app",
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "https://primevessellbackend.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://primevessels.com",
    "https://www.primevessels.com",
  ],
  plugins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "prime_vessels_super_secret_payload_key_2025_crockery_cutlery_secure",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      ssl: {
        rejectUnauthorized: false,
      },
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    },
    push: false,
  }),
});
