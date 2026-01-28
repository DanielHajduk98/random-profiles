import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SearchProfileCard from "../../app/components/search-profile-card.vue";
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

describe("search-profile-card", () => {
  it("highlights matching text in the name", async () => {
    const profile = makeProfile({ name: "Ada Lovelace" });
    const wrapper = await mountSuspended(SearchProfileCard, {
      props: { profile, query: "ada" },
    });

    const marks = wrapper.findAll("mark");
    expect(marks).toHaveLength(1);
    expect(marks[0]?.text()).toBe("Ada");
  });

  it("escapes special characters in the query", async () => {
    const profile = makeProfile({ name: "C++ Engineer" });
    const wrapper = await mountSuspended(SearchProfileCard, {
      props: { profile, query: "C++" },
    });

    const marks = wrapper.findAll("mark");
    expect(marks).toHaveLength(1);
    expect(marks[0]?.text()).toBe("C++");
  });

  it("renders plain text when query is empty", async () => {
    const profile = makeProfile({ name: "Ada Lovelace" });
    const wrapper = await mountSuspended(SearchProfileCard, {
      props: { profile, query: "" },
    });

    expect(wrapper.findAll("mark")).toHaveLength(0);
    expect(wrapper.text()).toContain("Ada Lovelace");
  });
});
