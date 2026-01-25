import { describe, expect, it } from "vitest";
import { mockEvent } from "h3";

import { ProfileSchema } from "../lib/types/profile-schema";
import handler from "../server/api/profiles.get";
import {
  getProfileCatalog,
  PROFILE_CATALOG_SIZE,
} from "../server/utils/profile-catalog";

const runHandler = async (url: string) => {
  const event = mockEvent(url);
  const response = await handler(event);

  return { event, response };
};

describe("GET /api/profiles", () => {
  it("initializes and caches the catalog", () => {
    const first = getProfileCatalog();
    const second = getProfileCatalog();

    expect(first).toHaveLength(PROFILE_CATALOG_SIZE);
    expect(second).toBe(first);
  });

  it("returns default count with no query", async () => {
    const { event, response } = await runHandler(
      "http://localhost/api/profiles",
    );

    expect(event.res.status).toBe(200);
    expect(Array.isArray(response)).toBe(true);
    expect(response).toHaveLength(10);
    expect(ProfileSchema.array().safeParse(response).success).toBe(true);
  });

  it("returns deterministic results across calls", async () => {
    const first = await runHandler("http://localhost/api/profiles?count=10");
    const second = await runHandler("http://localhost/api/profiles?count=10");

    expect(first.response).toEqual(second.response);
  });

  it("supports fuzzy search with matching query", async () => {
    const catalog = getProfileCatalog();
    const query = catalog[0]?.name.split(" ")[0] ?? "a";
    const { response } = await runHandler(
      `http://localhost/api/profiles?q=${encodeURIComponent(query)}&count=5`,
    );

    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeGreaterThan(0);
    expect(response.length).toBeLessThanOrEqual(5);
  });

  it("returns few or zero results for nonsense query", async () => {
    const { response } = await runHandler(
      "http://localhost/api/profiles?q=not-a-real-company-123456789&count=5",
    );

    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeLessThanOrEqual(5);
  });

  it("supports custom count parameter", async () => {
    const { response } = await runHandler(
      "http://localhost/api/profiles?count=3",
    );

    expect(Array.isArray(response)).toBe(true);
    expect(response).toHaveLength(3);
  });

  it("returns 400 for invalid count", async () => {
    const { event, response } = await runHandler(
      "http://localhost/api/profiles?count=abc",
    );

    expect(event.res.status).toBe(400);
    expect(response).toMatchObject({
      error: {
        code: "INVALID_COUNT",
      },
    });
  });

  it("returns 400 for negative count", async () => {
    const { event, response } = await runHandler(
      "http://localhost/api/profiles?count=-1",
    );

    expect(event.res.status).toBe(400);
    expect(response).toMatchObject({
      error: {
        code: "INVALID_COUNT",
      },
    });
  });

  it("returns 400 for repeated query param", async () => {
    const { event, response } = await runHandler(
      "http://localhost/api/profiles?q=one&q=two",
    );

    expect(event.res.status).toBe(400);
    expect(response).toMatchObject({
      error: {
        code: "REPEATED_QUERY_PARAM",
      },
    });
  });

  it("returns 400 for repeated count param", async () => {
    const { event, response } = await runHandler(
      "http://localhost/api/profiles?count=5&count=6",
    );

    expect(event.res.status).toBe(400);
    expect(response).toMatchObject({
      error: {
        code: "REPEATED_COUNT_PARAM",
      },
    });
  });
});
