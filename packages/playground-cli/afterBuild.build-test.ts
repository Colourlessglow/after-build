import { defineConfig } from '@whitekite/unplugin-after-build'

export default defineConfig(() => ({
  compress: ['gzip', 'brotli'],
  backup: 'pvWebs',
}))
