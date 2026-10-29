import type { CollectionConfig } from "payload";

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "email", "subject", "read", "createdAt"],
  },
  access: {
    create: () => true, // Publicly allow website visitors to submit enquiries
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Customer / Contact Name",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "Phone Number",
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
    },
    {
      name: "subject",
      type: "text",
      label: "Subject / Product of Interest",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Enquiry Message",
    },
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
      label: "Mark as Read",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "submittedAt",
      type: "date",
      label: "Submission Date",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
};
