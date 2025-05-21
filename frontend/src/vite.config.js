import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Handle SPA fallback for client-side routing
    historyApiFallback: true,
    // Configure proxy if needed for API requests
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Your Django backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Add base URL if your app is not served from the root
  base: '/',
  
  // Add these configurations to handle JSX in .js files
  esbuild: {
    loader: "jsx",
    include: [
      // Add the .js extension to be treated as JSX
      "src/**/*.js",
      "src/**/*.jsx", 
      "node_modules/**/*.js",
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});