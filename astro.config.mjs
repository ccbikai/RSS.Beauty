import process from 'node:process'
import cloudflare from '@astrojs/cloudflare'
import netlify from '@astrojs/netlify'
import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'

import { provider } from 'std-env'

const providers = {
  vercel: vercel({
    edgeMiddleware: false,
  }),
  cloudflare_workers: cloudflare({
    imageService: 'compile',
    workerEntryPoint: {
      path: 'src/worker.ts',
    },
  }),
  netlify: netlify({
    edgeMiddleware: false,
  }),
  node: node({
    mode: 'standalone',
  }),
}

const adapterProvider = process.env.SERVER_ADAPTER || provider

console.info(`Using adapter: ${adapterProvider}`)

export default defineConfig({
  adapter: providers[adapterProvider] || providers.node,
  integrations: [tailwind(), react()],
  vite: {
    ssr: {
      noExternal: process.env.DOCKER ? !!process.env.DOCKER : undefined,
    },
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        && (adapterProvider === 'cloudflare_workers' || process.env.DOCKER)
        && {
          'react-dom/server': 'react-dom/server.edge',
        },
    },
  },
})
