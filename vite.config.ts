import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'

/**
 * In production the files in `api/` are deployed as serverless functions. The
 * Vite dev server knows nothing about them, so this plugin loads the same
 * handler module and serves it at the same URL — `npm run dev` alone is enough
 * to work on both halves of the app.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/')) return next()

        const route = url.split('?')[0].replace(/\/$/, '')
        try {
          const mod = await server.ssrLoadModule(`.${route}.ts`)
          const handler = mod[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end('Method Not Allowed')
          }

          const request = new Request(new URL(url, `http://${req.headers.host}`), {
            method: req.method,
          })
          const response: Response = await handler(request)

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          if (err instanceof Error && err.message.includes('Failed to load url')) {
            res.statusCode = 404
            return res.end('Not Found')
          }
          next(err)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApi()],
})
