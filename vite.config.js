import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ml-course/',
  plugins: [
    vue(),
    // 只在构建时使用legacy插件
    ...(process.env.NODE_ENV === 'production' ? [
      legacy({
        targets: ['defaults'],
        renderLegacyChunks: true,
        polyfills: ['es.array.at']
      })
    ] : [])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          supabase: ['@supabase/supabase-js'],
          marked: ['marked']
        }
      }
    }
  }
});
