/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env["NEXT_PUBLIC_IMG_HOST"],
        port: "",
        pathname: "/tierlist-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
