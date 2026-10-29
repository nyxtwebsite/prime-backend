import fs from "fs";
import path from "path";

const viewsPath = path.resolve("backend/node_modules/@payloadcms/next/dist/views/Root/index.js");
if (fs.existsSync(viewsPath)) {
  const content = fs.readFileSync(viewsPath, "utf8");
  console.log("--- Root View content ---");
  console.log(content.slice(0, 2000));
}
