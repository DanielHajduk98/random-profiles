import { createError } from "h3";

const REPEATED_PARAM_ERROR = "Param must be provided once";
const MAX_QUERY_LENGTH = 64;

const isRepeatedParam = (value: unknown): boolean => Array.isArray(value);

const throwBadRequest = (message: string): never => {
  throw createError({
    statusCode: 400,
    statusMessage: message,
  });
};

export const parseCountParam = (
  value: unknown,
  defaultCount: number,
): number => {
  if (value === undefined) {
    return defaultCount;
  }

  if (isRepeatedParam(value)) {
    throwBadRequest(REPEATED_PARAM_ERROR);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    throwBadRequest("count must be a positive integer");
  }

  return parsed;
};

export const parseQueryParam = (
  value: unknown,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (isRepeatedParam(value)) {
    throwBadRequest(REPEATED_PARAM_ERROR);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }

    if (trimmed.length > MAX_QUERY_LENGTH) {
      return trimmed.slice(0, MAX_QUERY_LENGTH);
    }

    return trimmed;  }

  throwBadRequest("q must be a string");
};
