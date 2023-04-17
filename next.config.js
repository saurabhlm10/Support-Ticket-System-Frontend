/** @type {import('next').NextConfig} */

const { createProxyMiddleware } = require('http-proxy-middleware');

const nextConfig = {
  reactStrictMode: false,
  async serverMiddleware() {
    const apiProxy = createProxyMiddleware('/', {
      target: 'http://localhost:4004/api',
      changeOrigin: true,
      pathRewrite: {
        '^/': '',
      },
    });
  },
}

module.exports = nextConfig
