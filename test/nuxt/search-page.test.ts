import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import SearchPage from "../../app/pages/search.vue";
import type { Profile } from "../../lib/types/profile-schema";

const { useAsyncDataMock, useRouteMock, useRouterMock, getProfilesMock } = vi.hoisted(() => ({
  useAsyncDataMock: vi.fn(),
  useRouteMock: vi.fn(),
  useRouterMock: vi.fn(),
  getProfilesMock: vi.fn(),
}));

mockNuxtImport("useAsyncData", () => useAsyncDataMock);
mockNuxtImport("useRoute", () => useRouteMock);
mockNuxtImport("useRouter", () => useRouterMock);

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

describe("search page", () => {
  beforeEach(() => {
    useAsyncDataMock.mockReset();
    useRouteMock.mockReset();
    useRouterMock.mockReset();
    getProfilesMock.mockReset();
    useRouteMock.mockReturnValue({ path: "/search", query: { q: "Ada" } });
    useRouterMock.mockReturnValue({
      back: vi.fn(),
      replace: vi.fn(),
      push: vi.fn(),
      resolve: vi.fn((to: string | { path?: string }) => ({
        href: typeof to === "string" ? to : to.path ?? "/search",
      })),
    });
  });

  it("calls router.back when clicking the back button", async () => {
    const backMock = vi.fn();
    useRouterMock.mockReturnValue({
      back: backMock,
      replace: vi.fn(),
      push: vi.fn(),
      resolve: vi.fn((to: string | { path?: string }) => ({
        href: typeof to === "string" ? to : to.path ?? "/search",
      })),
    });
    useAsyncDataMock.mockResolvedValue(makeAsyncData());

    const wrapper = await mountSuspended(SearchPage);
    const backButton = wrapper
      .findAll("button")
      .find((button) => button.text().trim() === "Back");

    expect(backButton).toBeTruthy();
    await backButton?.trigger("click");

    expect(backMock).toHaveBeenCalled();
  });

  it("requests profiles for the query with a count of 10", async () => {
    const profiles = [makeProfile()];
    getProfilesMock.mockResolvedValue(profiles);
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile[] });
    });

    await mountSuspended(SearchPage);

    expect(getProfilesMock).toHaveBeenCalledWith({ count: 10, query: "Ada" });
  });

  it("does not request profiles when the query is empty", async () => {
    useRouteMock.mockReturnValue({ path: "/search", query: { q: "   " } });
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile[] });
    });

    await mountSuspended(SearchPage);

    expect(getProfilesMock).not.toHaveBeenCalled();
  });

  it("renders exactly 10 profiles when more are returned", async () => {
    const profiles = Array.from({ length: 12 }, (_, index) =>
      makeProfile({ id: `profile-${index + 1}` }),
    );
    getProfilesMock.mockResolvedValue(profiles);
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile[] });
    });

    const wrapper = await mountSuspended(SearchPage);

    expect(wrapper.findAll('[data-testid="search-profile-card"]')).toHaveLength(10);
  });
});
