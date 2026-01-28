import { describe, expect, it } from "vitest";
import {
  parseCountParam,
  parseQueryParam,
} from "../server/utils/profile-query-validation";

const expectBadRequest = (fn: () => unknown, message: string) => {
  try {
    fn();
    throw new Error("Expected bad request error");
  } catch (error) {
    expect(error).toMatchObject({
      statusCode: 400,
      statusMessage: message,
    });
  }
};

describe("profile-query-validation", () => {
  it("returns default count when undefined", () => {
    expect(parseCountParam(undefined, 10)).toBe(10);
  });

  it("parses valid count values", () => {
    expect(parseCountParam("5", 10)).toBe(5);
  });

  it("rejects invalid count values", () => {
    expectBadRequest(
      () => parseCountParam("abc", 10),
      "count must be a positive integer",
    );
    expectBadRequest(
      () => parseCountParam("2.5", 10),
      "count must be a positive integer",
    );
    expectBadRequest(
      () => parseCountParam("-1", 10),
      "count must be a positive integer",
    );
  });

  it("rejects repeated count values", () => {
    expectBadRequest(
      () => parseCountParam(["1", "2"], 10),
      "Param must be provided once",
    );
  });

  it("returns undefined for empty query", () => {
    expect(parseQueryParam("   ")).toBeUndefined();
    expect(parseQueryParam(undefined)).toBeUndefined();
  });

  it("trims query strings", () => {
    expect(parseQueryParam("  Ada  ")).toBe("Ada");
  });

  it("rejects repeated or non-string query values", () => {
    expectBadRequest(
      () => parseQueryParam(["one", "two"]),
      "Param must be provided once",
    );
    expectBadRequest(() => parseQueryParam(123), "q must be a string");
  });
});
