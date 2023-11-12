import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    build: {
      outDir: 'dist/client',
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, '/src'),
      },
    },
    define: {
      __BASE_URL__: JSON.stringify(env.BASE_URL),
    },
  }
})
