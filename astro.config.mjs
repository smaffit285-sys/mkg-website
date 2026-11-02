import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://www.miamiknifeguy.com",
  output: "server",
  adapter: vercel(),

  vite: {
    server: { allowedHosts: process.env.SITES_MANAGED_LINUX_CONTAINER === "1" ? ["terminal.local"] : [] },
    plugins: [tailwindcss()]
  }
});
