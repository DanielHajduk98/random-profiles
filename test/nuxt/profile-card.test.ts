import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ProfileCard from "../../app/components/profile-card.vue";
import type { Profile } from "../../lib/types/profile-schema";

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

describe("profile-card", () => {
  it("links to the profile detail and labels the card", async () => {
    const profile = makeProfile({ id: "profile-42", name: "Ada Lovelace" });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    const link = wrapper.find("a");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/profile/profile-42");
    expect(link.attributes("aria-label")).toBe("View profile for Ada Lovelace");
  });

  it("renders the avatar image by default", async () => {
    const profile = makeProfile();
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    const avatar = wrapper.find('[role="img"]');
    const image = wrapper.find("img");
    expect(image.exists()).toBe(true);
    expect(image.attributes("src")).toBe(profile.avatarUrl);
    expect(image.attributes("alt")).toBe("");
    expect(image.attributes("loading")).toBe("lazy");
    expect(avatar.attributes("aria-label")).toBe(`${profile.name} avatar`);
  });

  it("falls back to initials on image error", async () => {
    const profile = makeProfile({ name: "Ada Lovelace" });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    const image = wrapper.find("img");
    await image.trigger("error");

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find("span").text()).toBe("AL");
  });

  it("builds initials for multi-part names", async () => {
    const profile = makeProfile({ name: "Grace Brewster Murray" });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    await wrapper.find("img").trigger("error");
    expect(wrapper.find("span").text()).toBe("GB");
  });

  it("builds initials for single names", async () => {
    const profile = makeProfile({ name: "Ada" });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    await wrapper.find("img").trigger("error");
    expect(wrapper.find("span").text()).toBe("A");
  });

  it("ignores extra spaces in names", async () => {
    const profile = makeProfile({ name: "  Ada    Lovelace  " });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    await wrapper.find("img").trigger("error");
    expect(wrapper.find("span").text()).toBe("AL");
  });

  it("falls back to NA for empty names", async () => {
    const profile = makeProfile({ name: "   " });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    await wrapper.find("img").trigger("error");
    expect(wrapper.find("span").text()).toBe("NA");
  });

  it("renders name and bio text", async () => {
    const profile = makeProfile({
      name: "Ada Lovelace",
      bio: "Pioneer of computing.",
    });
    const wrapper = await mountSuspended(ProfileCard, {
      props: { profile },
    });

    expect(wrapper.text()).toContain("Ada Lovelace");
    expect(wrapper.text()).toContain("Pioneer of computing.");
  });
});
