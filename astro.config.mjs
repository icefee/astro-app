import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
    output: 'server',
    server: {
        port: 4444
    },
    adapter: cloudflare(),
    security: {
        checkOrigin: false
    }
})