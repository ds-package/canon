const isProduction = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: 'export',
  trailingSlash: true,
  basePath: isProduction ? '/canon' : '',
}

export default nextConfig
