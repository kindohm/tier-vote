/** @type {import('next').NextConfig} */

console.log("IMG_HOST:", process.env["NEXT_PUBLIC_IMG_HOST_NAME"] ?? "NOT SET");

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env["NEXT_PUBLIC_IMG_HOST_NAME"],
        port: "",
        pathname: "/tierlist-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
