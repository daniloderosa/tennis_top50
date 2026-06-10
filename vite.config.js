import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  base: "/tennis_top50/",
  server: {
    port: Number(process.env.PORT) || 5173,
  },
});
