/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout: 240,
    i18n: {
        locales: ['en-AU', 'en-US'],
        defaultLocale: 'en-AU',
        domains: [
            {
              domain: 'brewart.com',
              defaultLocale: 'en-AU',
            },
            {
              domain: 'brewart.com.au',
              defaultLocale: 'en-AU',
            },
          ],
    }
}

module.exports = nextConfig