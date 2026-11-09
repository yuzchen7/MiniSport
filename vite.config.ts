import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "./",
    plugins: [react()],
    server: {
        port: 5173
    },
    root: "src/renderer",
    define: {
        __PLATFORM__: JSON.stringify(process.platform)
    },
    build: {
        outDir: "../../dist/renderer",
        emptyOutDir: true
    }
});
