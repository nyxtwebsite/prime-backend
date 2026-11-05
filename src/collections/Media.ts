import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

import { getMediaFileURL } from "../lib/mediaStorage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: process.env.VERCEL ? "/tmp" : path.resolve(dirname, "../../public/media"),
    disableLocalStorage: Boolean(process.env.S3_BUCKET || process.env.AWS_BUCKET || process.env.VERCEL || process.env.NODE_ENV === "production"),
    mimeTypes: ["image/*", "video/*"],
    // A size name here would make Payload build a relative /api/media/file URL,
    // which can't reach files in cloud storage. Images too small for the thumbnail
    // size, or uploaded before sizes were generated, fall back to the original.
    adminThumbnail: ({ doc }) => {
      const sizes = doc.sizes as { thumbnail?: { filename?: string | null } } | undefined;
      const isImage = typeof doc.mimeType === "string" && doc.mimeType.startsWith("image/");
      const filename = sizes?.thumbnail?.filename || (isImage ? (doc.filename as string | null) : null);
      if (!filename) return null;
      return getMediaFileURL({
        filename: encodeURIComponent(filename),
        prefix: doc.prefix as string | null | undefined,
      });
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 960,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
      required: false,
    },
  ],
};
