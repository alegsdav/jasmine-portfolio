import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Artwork } from "./types";
import { MOCK_ARTWORKS } from "./mock-data";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

export const isSanityConfigured = Boolean(projectId);

let client: SanityClient | null = null;

if (isSanityConfigured) {
  client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    // Always fetch fresh data: we only ever query server-side (at build/
    // request time), never from the visitor's browser, so there's no
    // benefit to the CDN's cache — and freshness matters for "sold" status.
    useCdn: false,
  });
}

const builder = client ? createImageUrlBuilder(client) : null;

export function urlForImage(source: unknown, width = 1600) {
  if (!builder) return "";
  return builder.image(source as any).width(width).auto("format").url();
}

const ARTWORK_PROJECTION = `{
  "id": _id,
  "slug": slug.current,
  title,
  year,
  medium,
  dimensions,
  description,
  price,
  currency,
  status,
  buyLink,
  featured,
  size,
  order,
  "image": {
    "url": image.asset->url,
    "alt": coalesce(image.alt, title),
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }
}`;

/** All artworks, sorted for gallery display. Falls back to local sample data until Sanity is connected. */
export async function getAllArtworks(): Promise<Artwork[]> {
  if (!client) {
    return [...MOCK_ARTWORKS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  try {
    const artworks = await client.fetch<Artwork[]>(
      `*[_type == "artwork"] | order(order asc, _createdAt desc) ${ARTWORK_PROJECTION}`,
    );
    return artworks;
  } catch (err) {
    console.error("Failed to fetch artworks from Sanity, falling back to sample data.", err);
    return [...MOCK_ARTWORKS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | undefined> {
  if (!client) {
    return MOCK_ARTWORKS.find((a) => a.slug === slug);
  }

  try {
    const artwork = await client.fetch<Artwork | null>(
      `*[_type == "artwork" && slug.current == $slug][0] ${ARTWORK_PROJECTION}`,
      { slug },
    );
    return artwork ?? undefined;
  } catch (err) {
    console.error("Failed to fetch artwork from Sanity, falling back to sample data.", err);
    return MOCK_ARTWORKS.find((a) => a.slug === slug);
  }
}
