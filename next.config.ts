import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kyitgvpypbfahvqhfmul.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/product-images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "kyitgvpypbfahvqhfmul.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/category-images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "kyitgvpypbfahvqhfmul.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/project-images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
