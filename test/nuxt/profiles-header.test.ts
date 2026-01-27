import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import ProfilesHeader from "../../app/components/profiles-header.vue";

const { useRouteMock, useRouterMock } = vi.hoisted(() => ({
  useRouteMock: vi.fn(),
  useRouterMock: vi.fn(),
}));

mockNuxtImport("useRoute", () => useRouteMock);
mockNuxtImport("useRouter", () => useRouterMock);

describe("profiles-header", () => {
  beforeEach(() => {
    useRouteMock.mockReset();
    useRouterMock.mockReset();
  });

  it("renders an accessible search input", async () => {
    useRouteMock.mockReturnValue({ path: "/", query: {} });
    useRouterMock.mockReturnValue({ push: vi.fn(), replace: vi.fn(), back: vi.fn() });

    const wrapper = await mountSuspended(ProfilesHeader);

    const input = wrapper.get('input[type="search"]');
    expect(input.attributes("maxlength")).toBe("64");
    expect(input.attributes("placeholder")).toBe("Search profiles...");
    expect(input.attributes("aria-label")).toBe("Search profiles");
    expect(wrapper.find('label[for="profiles-search-input"]').exists()).toBe(true);
  });

  it("debounces navigation to the search page", async () => {
    vi.useFakeTimers();
    const pushMock = vi.fn();
    useRouteMock.mockReturnValue({ path: "/", query: {} });
    useRouterMock.mockReturnValue({ push: pushMock, replace: vi.fn(), back: vi.fn() });

    const wrapper = await mountSuspended(ProfilesHeader);
    await wrapper.get('input[type="search"]').setValue("Ada");

    expect(pushMock).not.toHaveBeenCalled();
    vi.advanceTimersByTime(350);
    await nextTick();

    expect(pushMock).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "Ada" },
    });

    vi.useRealTimers();
  });

  it("does not navigate on whitespace input", async () => {
    vi.useFakeTimers();
    const pushMock = vi.fn();
    const replaceMock = vi.fn();
    useRouteMock.mockReturnValue({ path: "/", query: {} });
    useRouterMock.mockReturnValue({ push: pushMock, replace: replaceMock, back: vi.fn() });

    const wrapper = await mountSuspended(ProfilesHeader);
    pushMock.mockClear();
    replaceMock.mockClear();
    await wrapper.get('input[type="search"]').setValue("   ");

    vi.advanceTimersByTime(350);
    await nextTick();

    expect(pushMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
