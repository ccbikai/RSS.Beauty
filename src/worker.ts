import type { SSRManifest } from 'astro'
import { handle } from '@astrojs/cloudflare/handler'
import { App } from 'astro/app'

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest)
  return {
    default: {
      async fetch(request: Request, env: Env, ctx: ExecutionContext) {
        return handle(manifest, app, request, env, ctx)
      },
    } satisfies ExportedHandler<Env>,
  }
}
