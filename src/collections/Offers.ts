import type { CollectionConfig } from "payload";

/**
 * Promotional offer tiles that sit inside the "Our Collections" category grid
 * (homepage and /categories page). Each offer spans two grid columns.
 */
export const Offers: CollectionConfig = {
  slug: "offers",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "eyebrow", "position", "displayLocation", "status"],
    description:
      "Wide promotional tiles shown inside the category grid (e.g. 'Special Offer — Plate 50% Off').",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      label: "Small Label Above Title",
      defaultValue: "Special Offer",
      admin: {
        description: "Shown in italic above the title, e.g. 'Special Offer', 'This Week'",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Offer Title",
      admin: {
        description: "e.g. 'Plate 50% Off', 'Cups 35% Off'",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Short Description",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Offer Image",
    },
    {
      type: "row",
      fields: [
        {
          name: "ctaLabel",
          type: "text",
          label: "Button Label",
          defaultValue: "Discover",
        },
        {
          name: "linkType",
          type: "select",
          label: "Link To",
          defaultValue: "category",
          options: [
            { label: "Category", value: "category" },
            { label: "Product", value: "product" },
            { label: "Custom URL", value: "custom" },
          ],
        },
      ],
    },
    {
      name: "linkedCategory",
      type: "relationship",
      relationTo: "categories",
      label: "Category",
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === "category",
      },
    },
    {
      name: "linkedProduct",
      type: "relationship",
      relationTo: "products",
      label: "Product",
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === "product",
      },
    },
    {
      name: "customLink",
      type: "text",
      label: "Custom URL",
      defaultValue: "/products",
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === "custom",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "backgroundColor",
          type: "select",
          label: "Background Tone",
          defaultValue: "blush",
          options: [
            { label: "Blush", value: "blush" },
            { label: "Sand", value: "sand" },
            { label: "Sage", value: "sage" },
            { label: "Stone", value: "stone" },
            { label: "Charcoal (light text)", value: "charcoal" },
          ],
        },
        {
          name: "imagePosition",
          type: "select",
          label: "Image Side",
          defaultValue: "right",
          options: [
            { label: "Right", value: "right" },
            { label: "Left", value: "left" },
          ],
        },
      ],
    },
    {
      name: "position",
      type: "number",
      label: "Show After Category #",
      defaultValue: 4,
      min: 0,
      required: true,
      admin: {
        position: "sidebar",
        description:
          "Where the offer appears in the grid. 4 = after the 4th category card, 8 = after the 8th, 0 = first.",
      },
    },
    {
      name: "displayLocation",
      type: "select",
      label: "Show On",
      hasMany: true,
      defaultValue: ["homepage", "categories-page"],
      options: [
        { label: "Homepage Collections", value: "homepage" },
        { label: "Categories Page", value: "categories-page" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "startDate",
      type: "date",
      label: "Starts On (Optional)",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "endDate",
      type: "date",
      label: "Ends On (Optional)",
      admin: {
        position: "sidebar",
        description: "The offer hides automatically after this date.",
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
  ],
};
