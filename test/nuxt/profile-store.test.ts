import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useProfileStore } from "../../app/stores/profile-store";
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

describe("profile-store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("stores and retrieves the selected profile by id", () => {
    const store = useProfileStore();
    const profile = makeProfile({ id: "profile-42" });

    store.setSelectedProfile(profile);

    expect(store.profileById("profile-42")).toEqual(profile);
    expect(store.profileById("profile-999")).toBeNull();
  });

  it("clears the selected profile", () => {
    const store = useProfileStore();
    store.setSelectedProfile(makeProfile());

    store.setSelectedProfile(null);

    expect(store.profileById("profile-1")).toBeNull();
  });
});
