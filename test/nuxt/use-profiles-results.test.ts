import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { ApiClientError } from "../../app/utils/api-client";
import { useProfilesResults } from "../../app/composables/use-profiles-results";
import type { Profile } from "../../lib/types/profile-schema";

const { useAsyncDataMock, getProfilesMock } = vi.hoisted(() => ({
  useAsyncDataMock: vi.fn(),
  getProfilesMock: vi.fn(),
}));

mockNuxtImport("useAsyncData", () => useAsyncDataMock);

vi.mock("../../app/utils/api-client", async () => {
  const actual = await vi.importActual<typeof import("../../app/utils/api-client")>(
    "../../app/utils/api-client",
  );

  return {
    ...actual,
    getProfiles: getProfilesMock,
  };
});

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

const makeAsyncData = (
  {
    data = [],
    pending = false,
    error = null,
  }: {
    data?: Profile[];
    pending?: boolean;
    error?: unknown;
  } = {},
) => ({
  data: ref(data),
  pending: ref(pending),
  error: ref(error),
});

describe("use-profiles-results", () => {
  beforeEach(() => {
    useAsyncDataMock.mockReset();
    getProfilesMock.mockReset();
  });

  it("skips fetching when query is empty and skipEmpty is true", async () => {
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile[] });
    });

    const result = await useProfilesResults({
      count: 5,
      query: "",
      resultsKey: "profiles-empty",
      skipEmpty: true,
    });

    expect(getProfilesMock).not.toHaveBeenCalled();
    expect(result.profiles.value).toEqual([]);
    expect(result.pending.value).toBe(false);
  });

  it("passes normalized query and count to getProfiles", async () => {
    const profiles = [makeProfile()];
    getProfilesMock.mockResolvedValue(profiles);
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile[] });
    });

    await useProfilesResults({
      count: 3,
      query: "  Ada  ",
      resultsKey: "profiles-normalized",
      skipEmpty: false,
    });

    expect(getProfilesMock).toHaveBeenCalledWith({ count: 3, query: "Ada" });
  });

  it("exposes error messages from ApiClientError", async () => {
    useAsyncDataMock.mockResolvedValue(
      makeAsyncData({
        error: new ApiClientError("network", "Network error"),
      }),
    );

    const result = await useProfilesResults({
      count: 3,
      query: "Ada",
      resultsKey: "profiles-error",
    });

    expect(result.errorMessage.value).toBe("Network error");
  });
});
