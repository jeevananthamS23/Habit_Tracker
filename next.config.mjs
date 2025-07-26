/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use remotePatterns for allowed image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true, // Allow SVG images from placehold.co
  },
};

// Use ES module export syntax
export default nextConfig;
