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
    ...(process.env.NODE_ENV === 'production'
      ? [
          legacy({
            targets: ['defaults'],
            renderLegacyChunks: true,
            polyfills: ['es.array.at'],
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000, // 增加chunk大小警告限制
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          supabase: ['@supabase/supabase-js'],
          marked: ['marked'],
          katex: ['katex'],
          swiper: ['swiper'],
        },
        // 提高缓存效率
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
    // 压缩选项
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true, // 生产环境移除debugger
      },
    },
  },
});
