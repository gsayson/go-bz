import solidStartVercel from "solid-start-vercel"
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({
    adapter: solidStartVercel({
      edge: true
    })
  })],
});
