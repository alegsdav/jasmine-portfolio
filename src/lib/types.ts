export type GallerySize = "wide" | "half" | "third";

export interface ArtworkImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/** A gallery piece. Never for sale — see `Product` for store items. */
export interface Artwork {
  id: string;
  slug: string;
  title: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
  featured?: boolean;
  size: GallerySize;
  image: ArtworkImage;
  order?: number;
}

export type ProductStatus = "in-stock" | "sold-out";

/** A store item — always for sale. */
export interface Product {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  status: ProductStatus;
  buyLink?: string;
  image: ArtworkImage;
  order?: number;
}
