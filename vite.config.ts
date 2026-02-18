import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // تحميل متغيرات البيئة بشكل آمن
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './', // ضروري جداً لنسخة سطح المكتب
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'), // تم إصلاح المسار ليعمل بشكل صحيح
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});
