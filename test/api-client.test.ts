import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiClientError,
  getProfileById,
  getProfiles,
} from "../app/utils/api-client";
import type { Profile } from "../lib/types/profile-schema";

const makeProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: "profile-1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  avatarUrl: "https://example.com/avatar.png",
  age: 36,
  jobTitle: "Mathematician",
  company: "Analytical Engines",
  phone: "+12345678901",
  address: "123 Main St",
  bio: "First programmer.",
  ...overrides,
});

const createFetchStub = <TResponse,>(
  implementation: () => Promise<TResponse>,
) => {
  const fetcher = vi.fn(implementation);
  vi.stubGlobal("$fetch", fetcher);
  return fetcher;
};

describe("api-client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches profiles with query params", async () => {
    const response = [makeProfile()];
    const fetcher = createFetchStub(async () => response);

    const result = await getProfiles({ count: 5, query: "ada" });

    expect(result).toEqual(response);
    expect(fetcher).toHaveBeenCalledWith("/api/profiles", {
      query: { count: 5, q: "ada" },
    });
  });

  it("fetches profile by id", async () => {
    const response = makeProfile({ id: "profile-42" });
    const fetcher = createFetchStub(async () => response);

    const result = await getProfileById("profile-42");

    expect(result).toEqual(response);
    expect(fetcher).toHaveBeenCalledWith("/api/profile/profile-42");
  });

  it("encodes profile id in the request path", async () => {
    const response = makeProfile({ id: "profile-encoded" });
    const fetcher = createFetchStub(async () => response);

    await getProfileById("profile/needs encoding");

    expect(fetcher).toHaveBeenCalledWith(
      "/api/profile/profile%2Fneeds%20encoding",
    );
  });

  it("throws validation error for invalid profiles response", async () => {
    createFetchStub(async () => [{ id: "" }]);

    await expect(getProfiles()).rejects.toMatchObject({
      type: "validation",
      message: "Response validation failed",
    });
  });

  it("normalizes not-found errors", async () => {
    createFetchStub(async () => {
      throw { statusCode: 404, statusMessage: "Not Found" };
    });

    await expect(getProfileById("missing")).rejects.toMatchObject({
      type: "not-found",
      statusCode: 404,
      message: "Not Found",
    });
  });

  it("normalizes validation errors from 400 responses", async () => {
    createFetchStub(async () => {
      throw { statusCode: 400, statusMessage: "Bad Request" };
    });

    await expect(getProfiles({ count: -1 })).rejects.toMatchObject({
      type: "validation",
      statusCode: 400,
      message: "Bad Request",
    });
  });

  it("normalizes network errors", async () => {
    createFetchStub(async () => {
      throw new TypeError("Failed to fetch");
    });

    await expect(getProfiles()).rejects.toMatchObject({
      type: "network",
      message: "Network error",
    });
  });

  it("normalizes unknown status errors", async () => {
    createFetchStub(async () => {
      throw { statusCode: 500, statusMessage: "Server Error" };
    });

    await expect(getProfiles()).rejects.toMatchObject({
      type: "unknown",
      statusCode: 500,
      message: "Server Error",
    });
  });

  it("falls back to unexpected errors for non-records", async () => {
    createFetchStub(async () => {
      throw "boom";
    });

    await expect(getProfiles()).rejects.toMatchObject({
      type: "unknown",
      message: "Unexpected error",
    });
  });

  it("exposes ApiClientError instances", async () => {
    const error = new ApiClientError("unknown", "Boom");
    createFetchStub(async () => {
      throw error;
    });

    await expect(getProfiles()).rejects.toBe(error);
  });
});