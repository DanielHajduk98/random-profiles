import { defineConfig } from "vitest/config";

const rootDir = new URL("./", import.meta.url).pathname;
const serverDir = new URL("./server", import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      "~~": rootDir,
      "@@": rootDir,
      "#server": serverDir,
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
