import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ytl/",
  plugins: [react()],
  server: {
    // allowedHosts: [".trycloudflare.com"], // for tunnel
  },
});
