/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kindohm.nyc3.digitaloceanspaces.com",
        port: "",
        pathname: "/tierlist-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
