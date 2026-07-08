import { defineField, defineType } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
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
      description: "Used in the page URL, e.g. /works/this-slug. Click 'Generate' after entering a title.",
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
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "medium",
      title: "Medium",
      description: "e.g. Graphite on paper, Oil on canvas",
      type: "string",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      description: "e.g. 11 × 14 in",
      type: "string",
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
          { title: "Available", value: "available" },
          { title: "Sold", value: "sold" },
          { title: "Not for sale", value: "not-for-sale" },
        ],
        layout: "radio",
      },
      initialValue: "not-for-sale",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      description: "Whole number, e.g. 250. Leave blank if not for sale.",
      type: "number",
      hidden: ({ document }) => document?.status !== "available",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
      hidden: ({ document }) => document?.status !== "available",
    }),
    defineField({
      name: "buyLink",
      title: "Buy link (Stripe Payment Link)",
      description:
        "Paste the Stripe Payment Link URL for this piece here once it's ready. Leave blank to show 'Purchase coming soon'.",
      type: "url",
      hidden: ({ document }) => document?.status !== "available",
    }),
    defineField({
      name: "size",
      title: "Gallery size",
      description: "How much space this piece takes up in the works grid.",
      type: "string",
      options: {
        list: [
          { title: "Third width", value: "third" },
          { title: "Half width", value: "half" },
          { title: "Full width", value: "wide" },
        ],
      },
      initialValue: "third",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      description: "Lower numbers appear first in the gallery.",
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
