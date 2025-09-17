import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  async redirects() {
    return [
      {
        source: '/foo',
        destination: '/bar',
        permanent: false, // keep false while testing to avoid browser cache
      },
      {
        source: '/atob',
        destination: '/ATO',
        permanent: true,
      },
      {
        source: '/calculators/c',
        destination: '/calculators/vehicles',
        permanent: true,
      },
    ];
  },
});
