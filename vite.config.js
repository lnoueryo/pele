import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  return {
    define: {
      'process.env.VITE_ENV': JSON.stringify(mode)
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          multiple: resolve(__dirname, 'multi.html'),
          solo: resolve(__dirname, 'solo.html'),
          login: resolve(__dirname, 'login.html'),
          ranking: resolve(__dirname, 'ranking.html'),
          '404': resolve(__dirname, '404.html'),
        },
      },
    },
  }
})