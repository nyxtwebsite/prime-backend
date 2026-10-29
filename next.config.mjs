import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sharp", "pg"],
  async rewrites() {
    return [
      {
        source: "/api/media/file/:path*",
        destination: "/media/:path*",
      },
    ];
  },
};

export default withPayload(nextConfig);

