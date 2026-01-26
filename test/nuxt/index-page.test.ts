import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mountSuspended, mockComponent, mockNuxtImport } from "@nuxt/test-utils/runtime";
import IndexPage from "../../app/pages/index.vue";
import { ApiClientError } from "../../app/utils/api-client";
import type { Profile } from "../../lib/types/profile-schema";

const { useAsyncDataMock, useHeadMock, getProfilesMock } = vi.hoisted(() => ({
  useAsyncDataMock: vi.fn(),
  useHeadMock: vi.fn(),
  getProfilesMock: vi.fn(),
}));

mockNuxtImport("useAsyncData", () => useAsyncDataMock);
mockNuxtImport("useHead", () => useHeadMock);

vi.mock("../../app/utils/api-client", async () => {
  const actual = await vi.importActual<typeof import("../../app/utils/api-client")>(
    "../../app/utils/api-client",
  );

  return {
    ...actual,
    getProfiles: getProfilesMock,
  };
});

mockComponent("ProfileCard", () =>
  import("vue").then(({ defineComponent, h }) =>
    defineComponent({
      props: { profile: { type: Object, required: true } },
      setup(props) {
        return () =>
          h("article", {
            "data-testid": "profile-card",
            "data-profile-id": (props.profile as Profile).id,
          });
      },
    }),
  ),
);

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

describe("index page", () => {
  beforeEach(() => {
    useAsyncDataMock.mockReset();
    useHeadMock.mockReset();
    getProfilesMock.mockReset();
  });

  it("requests profiles using the configured count", async () => {
    const profiles = [makeProfile({ id: "profile-1" })];
    getProfilesMock.mockResolvedValue(profiles);
    useAsyncDataMock.mockImplementation(async (_key: string, handler: () => unknown) => {
      const result = await handler();
      return makeAsyncData({ data: result as Profile[] });
    });

    await mountSuspended(IndexPage);

    expect(useAsyncDataMock).toHaveBeenCalledWith("profiles", expect.any(Function));
    expect(getProfilesMock).toHaveBeenCalledWith({ count: 16 });
  });

  it("renders loading skeletons while pending", async () => {
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ pending: true }));

    const wrapper = await mountSuspended(IndexPage);

    const status = wrapper.get('[role="status"]');
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.element.children.length).toBe(8);
  });

  it("renders an error message for ApiClientError", async () => {
    const error = new ApiClientError("network", "Network error");
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ error }));

    const wrapper = await mountSuspended(IndexPage);

    const alert = wrapper.get('[role="alert"]');
    expect(alert.text()).toContain("Unable to load profiles.");
    expect(alert.text()).toContain("Network error");
  });

  it("renders an error message for generic Error", async () => {
    const error = new Error("Something broke");
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ error }));

    const wrapper = await mountSuspended(IndexPage);

    expect(wrapper.get('[role="alert"]').text()).toContain("Something broke");
  });

  it("renders an unexpected error fallback", async () => {
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ error: { reason: "oops" } }));

    const wrapper = await mountSuspended(IndexPage);

    expect(wrapper.get('[role="alert"]').text()).toContain("Unexpected error");
  });

  it("renders profile cards when data is available", async () => {
    const profiles = [makeProfile({ id: "profile-1" }), makeProfile({ id: "profile-2" })];
    useAsyncDataMock.mockResolvedValue(makeAsyncData({ data: profiles }));

    const wrapper = await mountSuspended(IndexPage);

    const cards = wrapper.findAll('[data-testid="profile-card"]');
    expect(cards).toHaveLength(2);
    expect(cards[0]?.attributes("data-profile-id")).toBe("profile-1");
    expect(cards[1]?.attributes("data-profile-id")).toBe("profile-2");
  });

  it("sets the document head title and description", async () => {
    useAsyncDataMock.mockResolvedValue(makeAsyncData());

    await mountSuspended(IndexPage);

    expect(useHeadMock).toHaveBeenCalledWith({
      title: "Random Profiles Catalog",
      meta: [{ name: "description", content: "Random Profiles Catalog" }],
    });
  });
});
