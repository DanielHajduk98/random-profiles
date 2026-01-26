import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import ProfileDetailsPage from "../../app/pages/profile/[id].vue";
import { ApiClientError } from "../../app/utils/api-client";
import type { Profile } from "../../lib/types/profile-schema";

const {
  useAsyncDataMock,
  useRouteMock,
  useRouterMock,
  useHeadMock,
  getProfileByIdMock,
  profileStoreMock,
} = vi.hoisted(() => ({
  useAsyncDataMock: vi.fn(),
  useRouteMock: vi.fn(),
  useRouterMock: vi.fn(),
  useHeadMock: vi.fn(),
  getProfileByIdMock: vi.fn(),
  profileStoreMock: {
    profileById: vi.fn(),
    setSelectedProfile: vi.fn(),
  },
}));

mockNuxtImport("useAsyncData", () => useAsyncDataMock);
mockNuxtImport("useRoute", () => useRouteMock);
mockNuxtImport("useRouter", () => useRouterMock);
mockNuxtImport("useHead", () => useHeadMock);

vi.mock("../../app/utils/api-client", async () => {
  const actual = await vi.importActual<typeof import("../../app/utils/api-client")>(
    "../../app/utils/api-client",
  );

  return {
    ...actual,
    getProfileById: getProfileByIdMock,
  };
});

vi.mock("../../app/stores/profile-store", () => ({
  useProfileStore: () => profileStoreMock,
}));

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
    data = null,
    pending = false,
    error = null,
  }: {
    data?: Profile | null;
    pending?: boolean;
    error?: unknown;
  } = {},
) => ({
  data: ref(data),
  pending: ref(pending),
  error: ref(error),
});

describe("profile details page", () => {
  beforeEach(() => {
    useAsyncDataMock.mockReset();
    useRouteMock.mockReset();
    useRouterMock.mockReset();
    useHeadMock.mockReset();
    getProfileByIdMock.mockReset();
    profileStoreMock.profileById.mockReset();
    profileStoreMock.setSelectedProfile.mockReset();
    useRouteMock.mockReturnValue({ params: { id: "profile-1" } });
    useRouterMock.mockReturnValue({ back: vi.fn(), replace: vi.fn() });
  });

  it("uses cached profile data when available", async () => {
    const profile = makeProfile({ id: "profile-1" });
    profileStoreMock.profileById.mockImplementation((id: string) =>
      id === "profile-1" ? profile : null,
    );
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile });
    });

    const wrapper = await mountSuspended(ProfileDetailsPage);

    expect(getProfileByIdMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain(`${profile.name} (${profile.age})`);
  });

  it("fetches profile data on cache miss and stores it", async () => {
    const profile = makeProfile({ id: "profile-1" });
    profileStoreMock.profileById.mockReturnValue(null);
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile });
    });
    getProfileByIdMock.mockResolvedValue(profile);

    await mountSuspended(ProfileDetailsPage);

    expect(getProfileByIdMock).toHaveBeenCalledWith("profile-1");
    expect(profileStoreMock.setSelectedProfile).toHaveBeenCalledWith(profile);
  });

  it("renders not found state for ApiClientError not-found", async () => {
    const error = new ApiClientError("not-found", "Not found", { statusCode: 404 });
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ error }));

    const wrapper = await mountSuspended(ProfileDetailsPage);

    expect(wrapper.text()).toContain("Profile not found.");
  });

  it("renders email and phone links", async () => {
    const profile = makeProfile();
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ data: profile }));

    const wrapper = await mountSuspended(ProfileDetailsPage);

    const emailLink = wrapper.get(`a[href="mailto:${profile.email}"]`);
    const phoneLink = wrapper.get(`a[href="tel:${profile.phone}"]`);
    expect(emailLink.text()).toBe(profile.email);
    expect(phoneLink.text()).toBe(profile.phone);
  });

  it("calls router.back when clicking the back button", async () => {
    const backMock = vi.fn();
    useRouterMock.mockReturnValue({ back: backMock, replace: vi.fn() });
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ data: makeProfile() }));

    const wrapper = await mountSuspended(ProfileDetailsPage);
    await wrapper.get("button").trigger("click");

    expect(backMock).toHaveBeenCalled();
  });
});
