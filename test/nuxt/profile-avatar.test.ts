import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProfileAvatar from "../../app/components/profile-avatar.vue";

describe("profile-avatar", () => {
  it("uses the name for the avatar label", async () => {
    const wrapper = await mountSuspended(ProfileAvatar, {
      props: {
        name: "Ada Lovelace",
        avatarUrl: "https://example.com/avatar.png",
      },
    });

    expect(wrapper.attributes("aria-label")).toBe("Ada Lovelace avatar");
  });

  it("falls back to initials on image error", async () => {
    const wrapper = await mountSuspended(ProfileAvatar, {
      props: {
        name: "Ada Lovelace",
        avatarUrl: "https://example.com/avatar.png",
      },
    });

    await wrapper.find("img").trigger("error");

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find("span").text()).toBe("AL");
  });
});
