import { describe, expect, it } from "vitest";
import { searchProfiles } from "../server/utils/profile-search";
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

describe("profile-search", () => {
  it("returns the first N profiles when query is empty", () => {
    const catalog = [
      makeProfile({ id: "profile-1" }),
      makeProfile({ id: "profile-2", name: "Grace Hopper" }),
      makeProfile({ id: "profile-3", name: "Alan Turing" }),
    ];

    const results = searchProfiles(catalog, { count: 2 });

    expect(results).toEqual(catalog.slice(0, 2));
  });

  it("returns matching profiles for a query", () => {
    const target = makeProfile({
      id: "profile-2",
      name: "Grace Hopper",
      company: "US Navy",
    });
    const catalog = [
      makeProfile({ id: "profile-1", name: "Ada Lovelace" }),
      target,
      makeProfile({ id: "profile-3", name: "Alan Turing" }),
    ];

    const results = searchProfiles(catalog, { count: 5, query: "Hopper" });

    expect(results).toContainEqual(target);
  });

  it("respects the count limit for searches", () => {
    const catalog = [
      makeProfile({ id: "profile-1", name: "Ada Lovelace" }),
      makeProfile({ id: "profile-2", name: "Ada Byron" }),
      makeProfile({ id: "profile-3", name: "Alan Turing" }),
    ];

    const results = searchProfiles(catalog, { count: 1, query: "Ada" });

    expect(results).toHaveLength(1);
  });
});
