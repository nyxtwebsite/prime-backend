import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "showPrice", "featured", "status"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Product Name",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "Auto-generated or custom URL slug (e.g. royal-porcelain-dinner-set)",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      label: "Category",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      label: "Product Description",
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Main Image",
    },
    {
      name: "gallery",
      type: "array",
      label: "Image Gallery",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "price",
      type: "number",
      label: "Price (INR ₹)",
      admin: {
        description: "Product price in Indian Rupees. Displayed if Show Price is enabled.",
      },
    },
    {
      name: "offer",
      type: "number",
      label: "Discount / Offer Percentage (%)",
      min: 0,
      max: 100,
      admin: {
        description: "e.g. 15 for 15% discount. Automatically calculates discounted price on the frontend.",
      },
    },
    {
      name: "showPrice",
      type: "checkbox",
      label: "Show Price Publicly",
      defaultValue: true,
      required: true,
      admin: {
        description: "If unchecked or price is empty, 'Enquire for Price' will be displayed on the frontend.",
      },
    },
    {
      name: "sku",
      type: "text",
      label: "SKU / Item Code",
    },
    {
      name: "badge",
      type: "text",
      label: "Custom Badge / Ribbon Text",
      admin: {
        description: "e.g. 'Bestseller', 'New Arrival', 'Trending', '15% OFF', 'Banquet Set'",
      },
    },
    {
      name: "stockStatus",
      type: "select",
      label: "Stock Availability",
      options: [
        { label: "In Stock", value: "in_stock" },
        { label: "Out of Stock", value: "out_of_stock" },
        { label: "Made to Order / Bulk Enquiry", value: "made_to_order" },
      ],
      defaultValue: "in_stock",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "material",
      type: "text",
      label: "Primary Material Quality",
      admin: {
        description: "e.g. 'Fine Translucent Bone China', 'Forged 18/10 Stainless Steel (Titanium Gold PVD)', 'Lead-Free European Crystal'",
      },
    },
    {
      name: "specifications",
      type: "array",
      label: "Product Specifications & Highlights",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Specification Name (e.g. 'Pieces Included', 'Food Safety', 'Microwave Safe')",
        },
        {
          name: "value",
          type: "text",
          required: true,
          label: "Specification Detail (e.g. '24 Pieces for 6 Settings', '100% Lead-Free Certified', 'Yes')",
        },
      ],
    },
    {
      name: "careInstructions",
      type: "textarea",
      label: "Care & Dishwasher Instructions",
      admin: {
        description: "e.g. 'Dishwasher safe on gentle cycle. Hand washing recommended for gold trim pieces.'",
      },
    },
    {
      name: "customEnquiryMessage",
      type: "text",
      label: "Custom WhatsApp Enquiry Message Template (Optional)",
      admin: {
        description: "Overrides default message. e.g. 'Hi, I would like to enquire about the {productName} for a banquet order.'",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Featured Product",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Feature this product on homepage showcases",
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      defaultValue: "active",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "metaTitle",
      type: "text",
      label: "Meta Title (SEO)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Meta Description (SEO)",
      admin: {
        position: "sidebar",
      },
    },
  ],
};
