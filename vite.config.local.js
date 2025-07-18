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
      "dd86dff1-ac78-41a7-bdd4-4cef49e9d0ab-00-5jiuabjzpit6.spock.replit.dev",
      "localhost",
      "127.0.0.1",
    ],
  },
});
