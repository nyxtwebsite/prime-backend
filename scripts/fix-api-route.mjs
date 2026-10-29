import fs from "fs";
import path from "path";

const apiContent = `import config from '@/payload.config';
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);`;

const newApiPath = path.resolve("backend/src/app/(payload)/api/[...slug]/route.ts");
const newApiOptionalPath = path.resolve("backend/src/app/(payload)/api/[[...slug]]/route.ts");

fs.mkdirSync(path.dirname(newApiPath), { recursive: true });
fs.writeFileSync(newApiPath, apiContent, "utf8");

fs.mkdirSync(path.dirname(newApiOptionalPath), { recursive: true });
fs.writeFileSync(newApiOptionalPath, apiContent, "utf8");

// Remove old api/[[...segments]]
const oldApiPath = path.resolve("backend/src/app/(payload)/api/[[...segments]]");
if (fs.existsSync(oldApiPath)) {
  fs.rmSync(oldApiPath, { recursive: true, force: true });
}

console.log("✅ Fixed API route folder name to [...slug] and [[...slug]]");
