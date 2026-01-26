import { describe, expect, it } from "vitest";

import { ProfileSchema } from "../lib/types/profile-schema";
import { generateProfile } from "../server/utils/profile-generator";

describe("generateProfile", () => {
  it("returns deterministic output for same seed", () => {
    const first = generateProfile({ seed: "stable-seed" });
    const second = generateProfile({ seed: "stable-seed" });

    expect(first).toEqual(second);
  });

  it("returns deterministic output for same id", () => {
    const first = generateProfile({ id: "profile-123" });
    const second = generateProfile({ id: "profile-123" });

    expect(first).toEqual(second);
  });

  it("uses seed for randomness when provided", () => {
    const first = generateProfile({ id: "profile-123", seed: "seed-a" });
    const second = generateProfile({ id: "profile-999", seed: "seed-a" });

    const normalize = <TProfile extends { id: string; avatarUrl: string }>(
      profile: TProfile,
    ) => ({ ...profile, id: "fixed", avatarUrl: "fixed" });

    expect(normalize(first)).toEqual(normalize(second));
  });

  it("returns different output for different seeds", () => {
    const first = generateProfile({ seed: "seed-a" });
    const second = generateProfile({ seed: "seed-b" });

    expect(first).not.toEqual(second);
  });

  it("returns data matching the profile schema", () => {
    const profile = generateProfile({ seed: "schema-seed" });
    const result = ProfileSchema.safeParse(profile);

    expect(result.success).toBe(true);
  });
});