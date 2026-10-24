import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/aviso-de-privacidad", "/terminos"].map((p) => ({ url: `${site.url}${p}` }));
}
