import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { readdirSync } from 'node:fs';

function getDependencies() {
    /**
     * @type {string[]}
     */
    const modules = readdirSync('./node_modules')
    const dependencies = []
    for (const module of modules) {
        if (module.startsWith('@')) {
            dependencies.push(
                new RegExp(module + '(/.*)?')
            )
        }
        else if (!module.startsWith('.')) {
            dependencies.push(module)
        }
    }
    return dependencies
}

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    vite: {
        ssr: {
            noExternal: getDependencies()
        }
    }
});
