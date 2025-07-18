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
      "75b511fc-9053-4e66-8bd4-acddae9742ef-00-356gh47kldf3k.worf.replit.dev",
      "localhost",
      "127.0.0.1",
    ],
  },
});
