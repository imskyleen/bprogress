import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/__tests__/**/*', '**/*.test.*'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'BProgressVue',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@bprogress/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@bprogress/core': 'BProgressCore',
        },
      },
    },
  },
});
