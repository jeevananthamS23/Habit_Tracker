/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add 'placehold.co' to the list of allowed image domains
    domains: ['placehold.co'],
  },
};

// Use ES module export syntax
export default nextConfig;
