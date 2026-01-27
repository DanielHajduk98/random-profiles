export const MAX_QUERY_LENGTH = 64;

export const normalizeQuery = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.length > MAX_QUERY_LENGTH) {
    return trimmed.slice(0, MAX_QUERY_LENGTH);
  }

  return trimmed;
};

export const parseQueryParam = (value: unknown): string => {
  if (typeof value === "string") {
    return normalizeQuery(value);
  }

  if (Array.isArray(value)) {
    return normalizeQuery(value[0] ?? "");
  }

  return "";
};
