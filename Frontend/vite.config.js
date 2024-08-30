import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Allow connections from any IP address
    port: 3000, // Set the port you want to use (optional)
  },

  plugins: [react()],
});
