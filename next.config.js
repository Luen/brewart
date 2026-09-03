/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    staticPageGenerationTimeout: 240,
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
