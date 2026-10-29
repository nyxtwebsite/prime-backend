import type { CollectionConfig } from "payload";

export const Banners: CollectionConfig = {
  slug: "banners",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "displayLocation", "status", "sortOrder"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Banner Title",
    },
    {
      name: "subtitle",
      type: "text",
      label: "Banner Subtitle / Top Badge",
      admin: {
        description: "e.g. 'Showroom Collection', 'Luxury Dining Edition', 'Exclusive Offer'",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Banner Desktop Image",
    },
    {
      name: "mobileImage",
      type: "upload",
      relationTo: "media",
      label: "Banner Mobile Image (Optional Portrait Variant)",
    },
    {
      name: "description",
      type: "textarea",
      label: "Banner Description",
    },
    {
      name: "ctaLabel",
      type: "text",
      label: "Primary CTA Button Label",
      defaultValue: "Discover Now",
    },
    {
      name: "ctaLink",
      type: "text",
      label: "Primary CTA Button Link",
      defaultValue: "/products",
    },
    {
      name: "target",
      type: "select",
      label: "Link Open Target",
      options: [
        { label: "Same Tab (_self)", value: "_self" },
        { label: "New Tab (_blank)", value: "_blank" },
      ],
      defaultValue: "_self",
    },
    {
      name: "secondaryCtaLabel",
      type: "text",
      label: "Secondary CTA Button Label (Optional)",
    },
    {
      name: "secondaryCtaLink",
      type: "text",
      label: "Secondary CTA Button Link (Optional)",
    },
    {
      name: "displayLocation",
      type: "select",
      options: [
        { label: "Homepage Promo Slider", value: "homepage-promo" },
        { label: "Between Sections Banner", value: "between-sections" },
        { label: "Product Pages Banner", value: "product-pages" },
        { label: "Category Pages Banner", value: "category-pages" },
      ],
      defaultValue: "homepage-promo",
      required: true,
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first",
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
