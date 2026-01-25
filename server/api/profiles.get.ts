import { defineEventHandler } from "h3";
import { getProfileCatalog } from "#server/utils/profile-catalog";
import {
  buildErrorResponse,
  parseCountParam,
  parseQueryParam,
} from "#server/utils/profile-query-validation";
import { searchProfiles } from "#server/utils/profile-search";

const DEFAULT_COUNT = 10;

type QueryParams = Record<string, string | string[]>;
type ValidationResult<TValue> =
  | { ok: true; value: TValue }
  | { ok: false; error: { code: string; message: string } };
type ValidatedQueryParams = { count: number; query?: string };

const setStatus = (
  event: { res: { status?: number; statusText?: string } },
  status: number,
  statusText: string,
) => {
  event.res.status = status;
  event.res.statusText = statusText;
};

const getQueryParams = (event: { req: { url: string }; url?: URL }): QueryParams => {
  const url = event.url ?? new URL(event.req.url, "http://localhost");
  const query: QueryParams = {};

  for (const [key, value] of url.searchParams.entries()) {
    const current = query[key];

    if (current === undefined) {
      query[key] = value;
      continue;
    }

    if (Array.isArray(current)) {
      current.push(value);
      continue;
    }

    query[key] = [current, value];
  }

  return query;
};

const validateQueryParams = (query: QueryParams): ValidationResult<ValidatedQueryParams> => {
  const parsedCount = parseCountParam(query.count, DEFAULT_COUNT);
  if (!parsedCount.ok) {
    return parsedCount;
  }

  const parsedQuery = parseQueryParam(query.q);
  if (!parsedQuery.ok) {
    return parsedQuery;
  }

  return {
    ok: true,
    value: {
      count: parsedCount.value,
      query: parsedQuery.value,
    },
  };
};

export default defineEventHandler((event) => {
  const query = getQueryParams(event);
  const validation = validateQueryParams(query);
  if (!validation.ok) {
    setStatus(event, 400, "Bad Request");
    return buildErrorResponse(validation.error.code, validation.error.message);
  }

  try {
    const catalog = getProfileCatalog();
    const profiles = searchProfiles(catalog, {
      query: validation.value.query,
      count: validation.value.count,
    });

    setStatus(event, 200, "OK");
    return profiles;
  } catch (error) {
    setStatus(event, 500, "Internal Server Error");
    return buildErrorResponse(
      "INTERNAL_ERROR",
      "Unexpected error while loading profiles",
    );
  }
});
