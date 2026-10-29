import fs from "fs";
import path from "path";

const optionalPath = path.resolve("backend/src/app/(payload)/api/[[...slug]]");
if (fs.existsSync(optionalPath)) {
  fs.rmSync(optionalPath, { recursive: true, force: true });
  console.log("Removed [[...slug]], kept [...slug]");
}
