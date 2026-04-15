import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: false, // CSS 파일은 Style Dictionary가 생성하므로 clean 비활성화
  outDir: 'dist',
})
