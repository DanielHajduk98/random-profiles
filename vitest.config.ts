import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";

const rootDir = new URL("./", import.meta.url).pathname;
const serverDir = new URL("./server", import.meta.url).pathname;
const resolveAlias = {
  "~~": rootDir,
  "@@": rootDir,
  "#server": serverDir,
};

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: resolveAlias,
        },
        test: {
          name: "unit",
          environment: "node",
          include: ["test/**/*.test.ts"],
          exclude: ["test/nuxt/**"],
        },
      },
      defineVitestProject({
        resolve: {
          alias: resolveAlias,
        },
        test: {
          name: "nuxt",
          environment: "nuxt",
          include: ["test/nuxt/**/*.test.ts"],
          environmentOptions: {
            nuxt: {
              domEnvironment: "jsdom",
            },
          },
        },
      }),
    ],
  },
});
