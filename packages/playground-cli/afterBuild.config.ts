import { defineConfig } from '@whitekite/after-build'

export default defineConfig(() => ({
  compress: ['gzip', 'brotli'],
  backup: 'pvWeb',
}))
