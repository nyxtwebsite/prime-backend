import type { GlobalConfig } from "payload";

export const WhatsAppSettings: GlobalConfig = {
  slug: "whats-app-settings",
  label: "WhatsApp & Enquiry Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "whatsappNumber",
      type: "text",
      label: "WhatsApp Number (with country code, no + or spaces)",
      defaultValue: "918086580402",
      required: true,
      admin: {
        description: "e.g. 918086580402 (for +91 80865 80402)",
      },
    },
    {
      name: "defaultMessage",
      type: "text",
      label: "Default Global Floating Button Message",
      defaultValue: "Hi, I am interested in Prime Vessels crockery and cutlery collections. Could you please provide more details?",
      required: true,
    },
    {
      name: "productMessageTemplate",
      type: "text",
      label: "Product Enquiry Template",
      defaultValue: "Hi, I am interested in the {productName}. Could you please provide more details?",
      admin: {
        description: "Use {productName} as placeholder",
      },
    },
    {
      name: "floatingButtonEnabled",
      type: "checkbox",
      label: "Enable Floating WhatsApp Button",
      defaultValue: true,
    },
  ],
};
