/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.kindohmfiles.xyz",
        port: "",
        pathname: "/tierlist-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
