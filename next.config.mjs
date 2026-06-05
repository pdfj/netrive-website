/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Supabase storage images if needed in future
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
