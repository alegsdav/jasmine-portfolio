export type ArtworkStatus = "available" | "sold" | "not-for-sale";

export type GallerySize = "wide" | "half" | "third";

export interface ArtworkImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
  price?: number;
  currency?: string;
  status: ArtworkStatus;
  buyLink?: string;
  featured?: boolean;
  size: GallerySize;
  image: ArtworkImage;
  order?: number;
}
