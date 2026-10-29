import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "authorName",
    defaultColumns: ["authorName", "roleOrCompany", "rating", "status", "sortOrder"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "authorName",
      type: "text",
      label: "Author Name",
      required: true,
    },
    {
      name: "roleOrCompany",
      type: "text",
      label: "Role or Company (Optional)",
      admin: {
        description: "e.g., 'CEO, Prime Vessels' or 'Verified Customer'",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Author Photo (Optional)",
      admin: {
        description: "Small round photo. Initials are shown when empty.",
      },
    },
    {
      name: "content",
      type: "textarea",
      label: "Testimonial Content",
      required: true,
    },
    {
      name: "storyLink",
      type: "text",
      label: "'Read Story' Link (Optional)",
      admin: {
        description: "Leave empty to have 'Read Story' expand the full quote in place.",
      },
    },
    {
      name: "rating",
      type: "number",
      label: "Rating (1-5)",
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
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
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first.",
      },
    },
  ],
};
