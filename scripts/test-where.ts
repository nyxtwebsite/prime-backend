import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(".env") });

import { getPayload } from "payload";
import config from "../src/payload.config";

async function test() {
  try {
    const payload = await getPayload({ config });
    console.log("Testing find with where clause:");
    const res = await payload.find({
      collection: "categories",
      where: {
        status: {
          equals: "active",
        },
      },
    });
    console.log("Categories with where:", res.docs.length);

    console.log("Testing find with depth=2:");
    const res2 = await payload.find({
      collection: "products",
      where: {
        status: {
          equals: "active",
        },
      },
      depth: 2,
    });
    console.log("Products with depth=2:", res2.docs.length);

    console.log("Testing findGlobal with depth=2:");
    const res3 = await payload.findGlobal({
      slug: "site-settings",
      depth: 2,
    });
    console.log("Site settings found:", res3.brandName);
  } catch (err) {
    console.error("ERROR IN WHERE TEST:", err);
  }
}

test();
