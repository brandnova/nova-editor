import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/nova-editor/",
  plugins: [react()],
  build: {
    lib: {
      entry: "./src/standalone.js",
      name: "NovaEditor",
      fileName: (format) => `nova-editor.${format}.js`,
      formats: ["umd"],
    },
    outDir: "dist-standalone",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "nova-editor.[ext]",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
})
