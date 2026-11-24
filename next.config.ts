import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cache Components is intentionally OFF: this is a fully static,
     file-driven site, and generateStaticParams must be allowed to
     return zero slugs before the first real article exists (Next 16
     Cache Components requires at least one). Classic static generation
     (generateStaticParams + dynamicParams = false) is the right fit. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
