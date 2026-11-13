import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: !options.watch,
  clean: false,
  onSuccess: options.watch ? 'node scripts/build.js && tsup --dts-only' : undefined,
  outDir: 'dist',
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.mjs' }
  },
}))
