/** @type {import('next').NextConfig} */

const { createProxyMiddleware } = require('http-proxy-middleware');

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['lh3.googleusercontent.com', 'upload.wikimedia.org', 'imgv3.fotor.com']
}
}

module.exports = nextConfig
