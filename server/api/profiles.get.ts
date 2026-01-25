import { createError, defineEventHandler } from "h3";
import { getProfileCatalog } from "#server/utils/profile-catalog";
import {
  parseCountParam,
  parseQueryParam,
} from "#server/utils/profile-query-validation";
import { searchProfiles } from "#server/utils/profile-search";

const DEFAULT_COUNT = 10;

type QueryParams = Record<string, string | string[]>;
type ValidatedQueryParams = { count: number; query?: string };

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

const validateQueryParams = (query: QueryParams): ValidatedQueryParams => {
  const parsedCount = parseCountParam(query.count, DEFAULT_COUNT);
  const parsedQuery = parseQueryParam(query.q);

  return {
    count: parsedCount,
    query: parsedQuery,
  };
};

export default defineEventHandler((event) => {
  const query = getQueryParams(event);
  const validation = validateQueryParams(query);

  try {
    const catalog = getProfileCatalog();
    const profiles = searchProfiles(catalog, {
      query: validation.query,
      count: validation.count,
    });

    return profiles;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
