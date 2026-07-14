import type { StructureResolver } from "sanity/structure";

/**
 * Splits the Studio sidebar into "Gallery" and "Store" sections so editing
 * one never gets mixed up with the other — gallery pieces are never for
 * sale, store products always are.
 */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Gallery")
        .child(S.documentTypeList("artwork").title("Gallery")),
      S.listItem()
        .title("Store")
        .child(S.documentTypeList("product").title("Store")),
    ]);
