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

const expectHttpError = (
  action: () => unknown,
  statusCode: number,
  statusMessage: string,
) => {
  try {
    action();
  } catch (error) {
    expect(error).toMatchObject({ statusCode, statusMessage });
    return;
  }

  throw new Error("Expected handler to throw an HTTPError");
};

describe("GET /api/profile/:id", () => {
  it("returns a matching profile by id", async () => {
    const catalog = getProfileCatalog();
    const expected = catalog[0];
    if (!expected) {
      throw new Error("Catalog is empty");
    }
    const { response } = await runHandler(expected.id);

    expect(response).toEqual(expected);
    expect(ProfileSchema.safeParse(response).success).toBe(true);
  });

  it("returns 404 for unknown id", async () => {
    const event = mockEvent("http://localhost/api/profile");
    event.context.params = { id: "profile-does-not-exist" };

    expectHttpError(() => handler(event), 404, "Not Found");
  });

  it("returns 400 when id is missing", async () => {
    const event = mockEvent("http://localhost/api/profile");

    expectHttpError(() => handler(event), 400, "Bad Request");
  });

  it("returns deterministic results for the same id", async () => {
    const catalog = getProfileCatalog();
    const id = catalog[1]?.id ?? catalog[0]?.id ?? "profile-1";
    const first = await runHandler(id);
    const second = await runHandler(id);

    expect(first.response).toEqual(second.response);
  });
});
