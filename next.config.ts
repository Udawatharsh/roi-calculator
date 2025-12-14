/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/roi-calculator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/roi-calculator/' : '',
}

module.exports = nextConfig