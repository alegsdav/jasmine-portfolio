import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Used in the page URL, e.g. /store/this-slug. Click 'Generate' after entering a title.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          description: "Short description for accessibility / SEO.",
          type: "string",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "In stock", value: "in-stock" },
          { title: "Sold out", value: "sold-out" },
        ],
        layout: "radio",
      },
      initialValue: "in-stock",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      description: "Whole number, e.g. 5.",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
    }),
    defineField({
      name: "buyLink",
      title: "Buy link (Stripe Payment Link)",
      description:
        "Paste the Stripe Payment Link URL for this product here once it's ready. Leave blank to show 'Purchase coming soon'.",
      type: "url",
      hidden: ({ document }) => document?.status !== "in-stock",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      description: "Lower numbers appear first in the store.",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      status: "status",
    },
    prepare({ title, media, status }) {
      return {
        title,
        subtitle: status,
        media,
      };
    },
  },
});
