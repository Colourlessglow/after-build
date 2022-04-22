import { defineConfig } from '@whitekite/unplugin-after-build'

export default defineConfig((env) => ({
  compress: ['gzip', 'brotli'],
  backup: 'pvWeb',
  publish: {
    enable: env.VITE_AUTO_PUBLISH === 'true',
    host: env.VITE_PUBLISH_HOST,
    port: Number(env.VITE_PUBLISH_PORT),
    user: env.VITE_PUBLISH_USER,
    password: env.VITE_PUBLISH_PASSWORD,
    path: env.VITE_PUBLISH_ROOT,
  },
}))
