import type { GlobalConfig } from "payload";

export const HomepageSettings: GlobalConfig = {
  slug: "homepage-settings",
  label: "Homepage Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Section Visibility Toggles
    {
      type: "collapsible",
      label: "Homepage Section Visibility Toggles",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "showHero",
          type: "checkbox",
          label: "Show Hero Carousel / Video",
          defaultValue: true,
        },
        {
          name: "showCategories",
          type: "checkbox",
          label: "Show Categories Bento Showcase",
          defaultValue: true,
        },
        {
          name: "showPromoBanner",
          type: "checkbox",
          label: "Show Middle Promotional Banner",
          defaultValue: true,
        },
        {
          name: "showFeaturedProducts",
          type: "checkbox",
          label: "Show Featured Products Grid",
          defaultValue: true,
        },
        {
          name: "showSelectedCategory",
          type: "checkbox",
          label: "Show Highlighted Category Spotlight",
          defaultValue: true,
        },
        {
          name: "showTestimonials",
          type: "checkbox",
          label: "Show Client Testimonials Section",
          defaultValue: true,
        },
        {
          name: "showGalleryGrid",
          type: "checkbox",
          label: "Show Bottom Image Grid",
          defaultValue: true,
        },
      ],
    },

    // Hero Section Settings
    {
      type: "collapsible",
      label: "Hero Slide / Video Settings",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "heroType",
          type: "select",
          options: [
            { label: "Image", value: "image" },
            { label: "Video", value: "video" },
          ],
          defaultValue: "image",
          label: "Hero Media Type",
        },
        {
          name: "heroMedia",
          type: "upload",
          relationTo: "media",
          label: "Hero Image or Video",
        },
        {
          name: "heroSubtitle",
          type: "text",
          label: "Hero Subtitle / Badge",
          defaultValue: "Signature Collection",
        },
        {
          name: "heroTitle",
          type: "text",
          label: "Hero Title",
          defaultValue: "Elegance in Every Vessel",
        },
        {
          name: "heroSubtext",
          type: "textarea",
          label: "Hero Subtext",
          defaultValue: "Explore our masterfully crafted crockery, fine cutlery, and luxury dining essentials designed to elevate every table setting.",
        },
        {
          name: "heroCtaLabel",
          type: "text",
          label: "Primary CTA Label",
          defaultValue: "Explore Collection",
        },
        {
          name: "heroCtaLink",
          type: "text",
          label: "Primary CTA Link",
          defaultValue: "/products",
        },
        {
          name: "heroSecondaryCtaLabel",
          type: "text",
          label: "Secondary CTA Label",
          defaultValue: "Contact Showroom",
        },
        {
          name: "heroSecondaryCtaLink",
          type: "text",
          label: "Secondary CTA Link",
          defaultValue: "/contact",
        },
      ],
    },

    // Categories Showcase Settings
    {
      type: "collapsible",
      label: "Categories Showcase Section",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "categoriesSectionBadge",
          type: "text",
          label: "Categories Section Badge",
          defaultValue: "",
        },
        {
          name: "categoriesSectionTitle",
          type: "text",
          label: "Categories Section Title",
          defaultValue: "Our Collections",
        },
        {
          name: "categoriesSectionSubtext",
          type: "textarea",
          label: "Categories Section Subtitle",
          defaultValue: "Browse our crockery, cutlery, and tableware collections.",
        },
      ],
    },

    // Featured Products Grid Settings
    {
      type: "collapsible",
      label: "Featured Products Section",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "featuredSectionBadge",
          type: "text",
          label: "Featured Section Badge",
          defaultValue: "Showroom Spotlight",
        },
        {
          name: "featuredSectionTitle",
          type: "text",
          label: "Featured Products Section Title",
          defaultValue: "Trending Crockery & Cutlery",
        },
        {
          name: "featuredSectionSubtext",
          type: "textarea",
          label: "Featured Section Subtitle",
          defaultValue: "Handpicked selections from our most coveted dining collections.",
        },
      ],
    },

    // Selected Category Spotlight Section
    {
      type: "collapsible",
      label: "Selected Category Spotlight Section",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "selectedCategorySectionBadge",
          type: "text",
          label: "Category Spotlight Badge",
          defaultValue: "Featured Category",
        },
        {
          name: "selectedCategorySectionTitle",
          type: "text",
          label: "Selected Category Section Title",
          defaultValue: "Signature Dinnerware Collection",
        },
        {
          name: "selectedCategorySectionSubtext",
          type: "textarea",
          label: "Selected Category Section Subtitle",
          defaultValue: "Discover premium dining vessels crafted with timeless sophistication.",
        },
        {
          name: "selectedCategorySectionCtaLabel",
          type: "text",
          label: "Selected Category CTA Button Label",
          defaultValue: "Explore Collection",
        },
        {
          name: "selectedCategory",
          type: "relationship",
          relationTo: "categories",
          label: "Highlighted Category",
        },
      ],
    },

    // Client Testimonials Section
    {
      type: "collapsible",
      label: "Client Testimonials Section",
      admin: {
        initCollapsed: false,
        description: "Testimonial cards themselves are managed in the Testimonials collection.",
      },
      fields: [
        {
          name: "testimonialsTitle",
          type: "text",
          label: "Section Title",
          defaultValue: "What Our Clients Say",
        },
        {
          name: "testimonialsSubtext",
          type: "textarea",
          label: "Section Subtitle",
          defaultValue:
            "Curated dinnerware and cutlery appreciated by leading restaurants, interior architects, and discerning hosts.",
        },
        {
          type: "row",
          fields: [
            {
              name: "testimonialsRatingValue",
              type: "text",
              label: "Overall Rating",
              defaultValue: "4.8",
            },
            {
              name: "testimonialsReviewCount",
              type: "text",
              label: "Review Count Label",
              defaultValue: "500+ reviews",
            },
          ],
        },
        {
          name: "testimonialsRatingSubtext",
          type: "text",
          label: "Rating Card Footnote",
          defaultValue: "From homes, hotels and restaurants across Kerala",
        },
      ],
    },

    // Bottom Image Grid (1 large image left, 2 stacked right)
    {
      type: "collapsible",
      label: "Bottom Image Grid",
      admin: {
        initCollapsed: false,
        description:
          "Shown just above the footer. Image 1 is the large left tile; images 2 and 3 stack on the right.",
      },
      fields: [
        {
          name: "galleryGridImages",
          type: "array",
          label: "Grid Images",
          maxRows: 3,
          labels: { singular: "Image", plural: "Images" },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "link",
              type: "text",
              label: "Link (Optional)",
              admin: {
                description: "e.g. /categories/brass or /products",
              },
            },
          ],
        },
      ],
    },
  ],
};
