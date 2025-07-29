import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "all",
      "36347c12-f492-44ce-9b8f-0d703dec878f-00-3j2r4a728owqx.picard.replit.dev",
      "localhost",
      "127.0.0.1",
    ],
  },
});
