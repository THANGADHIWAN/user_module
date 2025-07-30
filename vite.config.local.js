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
      "4135ac52-4029-4042-8d3e-456d5a514eb2-00-ba4s336a1ub7.picard.replit.dev",
      "localhost",
      "127.0.0.1",
    ],
  },
});
