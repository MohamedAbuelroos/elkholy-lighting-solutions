import type { NextConfig } from "next";

const storageHosts = [
  "kyitgvpypbfahvqhfmul.supabase.co",
  "kezvcynbjsdzkexswrmi.supabase.co",
] as const;

const imageBuckets = [
  "product-images",
  "category-images",
  "project-images",
] as const;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: storageHosts.flatMap((hostname) =>
      imageBuckets.map((bucket) => ({
        protocol: "https" as const,
        hostname,
        port: "",
        pathname: `/storage/v1/object/public/${bucket}/**`,
        search: "",
      })),
    ),
  },
};

export default nextConfig;
