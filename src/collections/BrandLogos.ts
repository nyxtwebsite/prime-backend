import type { CollectionConfig } from "payload";

export const BrandLogos: CollectionConfig = {
  slug: "brand-logos",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status", "sortOrder"],
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
      label: "Brand Name",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Logo",
      admin: {
        description: "Transparent PNG or SVG recommended for the best result in the scrolling strip.",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Display Order (Optional)",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first.",
        position: "sidebar",
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
