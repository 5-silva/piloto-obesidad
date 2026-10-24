import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/portal", "/tamizaje", "/login", "/api"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
