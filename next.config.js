const {
  createVanillaExtractPlugin,
} = require('@mh-jack/vanilla-extract-next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = withVanillaExtract(nextConfig)
