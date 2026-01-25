import { describe, expect, it } from "vitest";
import { mockEvent } from "h3";

import { ProfileSchema } from "../lib/types/profile-schema";
import handler from "../server/api/profile/[id].get";
import { getProfileCatalog } from "../server/utils/profile-catalog";

const runHandler = async (id?: string) => {
  const event = mockEvent("http://localhost/api/profile");
  if (id !== undefined) {
    event.context.params = { id };
  }

  const response = await handler(event);

  return { event, response };
};

describe("GET /api/profile/:id", () => {
  it("returns a matching profile by id", async () => {
    const catalog = getProfileCatalog();
    const expected = catalog[0];
    const { event, response } = await runHandler(expected.id);

    expect(event.res.status).toBe(200);
    expect(response).toEqual(expected);
    expect(ProfileSchema.safeParse(response).success).toBe(true);
  });

  it("returns 404 for unknown id", async () => {
    const { event, response } = await runHandler("profile-does-not-exist");

    console.log(event.res.status);

    expect(event.res.status).toBe(404);
    expect(response).toMatchObject({
      error: {
        code: "PROFILE_NOT_FOUND",
        message: "Profile not found",
      },
    });
  });

  it("returns 404 when id is missing", async () => {
    const { event, response } = await runHandler();

    expect(event.res.status).toBe(404);
    expect(response).toMatchObject({
      error: {
        code: "PROFILE_NOT_FOUND",
      },
    });
  });

  it("returns deterministic results for the same id", async () => {
    const catalog = getProfileCatalog();
    const id = catalog[1]?.id ?? catalog[0]?.id ?? "profile-1";
    const first = await runHandler(id);
    const second = await runHandler(id);

    expect(first.response).toEqual(second.response);
  });
});
