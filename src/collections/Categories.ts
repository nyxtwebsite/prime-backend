import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "status", "updatedAt"],
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
      label: "Category Name",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "Auto-generated or custom URL identifier (e.g. luxury-dinnerware)",
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
      name: "tagline",
      type: "text",
      label: "Card Subtitle (Optional)",
      admin: {
        description: "Short line under the name on collection cards, e.g. 'Vases', 'Pottery'",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Category Thumbnail",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Category Page Banner / Hero Image (Optional)",
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Feature on Homepage Showcase",
      defaultValue: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Display Order",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first",
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
