import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    allowedHosts: [
      'unvitiable-amya-dimensionally.ngrok-free.dev',
      '.ngrok-free.dev'
    ]
  },
  // ── ADD THIS BUILD BLOCK BELOW TO FIX THE CHUNK SIZE WARNING ──
  build: {
    // Raises the chunk warning limit from 500kB to 2500kB (2.5MB)
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separates massive 3D modules out from your layout bundles
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            // Separates heavy runtime vector animations into an isolated block
            if (id.includes('gsap') || id.includes('framer-motion')) {
              return 'vendor-motion';
            }
          }
        }
      }
    }
  }
})
