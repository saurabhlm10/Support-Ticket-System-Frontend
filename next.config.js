/** @type {import('next').NextConfig} */

const { createProxyMiddleware } = require('http-proxy-middleware');

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
		return [
			{
				source: '/:path*',
				destination: 'http://localhost:4004/:path*',
			},
		]
	},
}

module.exports = nextConfig
