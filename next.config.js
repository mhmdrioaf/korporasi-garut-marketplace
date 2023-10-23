/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1366],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ygbjenkihubikfacxzfy.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;
