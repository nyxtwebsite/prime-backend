import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(".env") });

import { getPayload } from "payload";
import config from "../src/payload.config";

async function test() {
  try {
    const payload = await getPayload({ config });
    console.log("Payload initialized successfully");

    const categories = await payload.find({
      collection: "categories",
      limit: 10,
    });
    console.log("Categories found:", categories.docs.length);

    const products = await payload.find({
      collection: "products",
      limit: 10,
    });
    console.log("Products found:", products.docs.length);

    const globals = await payload.findGlobal({
      slug: "site-settings",
    });
    console.log("SiteSettings:", globals.brandName);
  } catch (err) {
    console.error("ERROR IN PAYLOAD TEST:", err);
  }
}

test();
