type QueryValidationResult<TValue> =
  | { ok: true; value: TValue }
  | { ok: false; error: { code: string; message: string } };

const REPEATED_PARAM_ERROR = "Param must be provided once";

export const buildErrorResponse = (code: string, message: string) => ({
  error: {
    code,
    message,
  },
});

const isRepeatedParam = (value: unknown): boolean => Array.isArray(value);

export const parseCountParam = (
  value: unknown,
  defaultCount: number,
): QueryValidationResult<number> => {
  if (value === undefined) {
    return { ok: true, value: defaultCount };
  }

  if (isRepeatedParam(value)) {
    return {
      ok: false,
      error: {
        code: "REPEATED_COUNT_PARAM",
        message: REPEATED_PARAM_ERROR,
      },
    };
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_COUNT",
        message: "count must be a positive integer",
      },
    };
  }

  return { ok: true, value: parsed };
};

export const parseQueryParam = (
  value: unknown,
): QueryValidationResult<string | undefined> => {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }

  if (isRepeatedParam(value)) {
    return {
      ok: false,
      error: {
        code: "REPEATED_QUERY_PARAM",
        message: REPEATED_PARAM_ERROR,
      },
    };
  }

  if (typeof value !== "string") {
    return {
      ok: false,
      error: {
        code: "INVALID_QUERY",
        message: "q must be a string",
      },
    };
  }

  const trimmed = value.trim();

  return { ok: true, value: trimmed.length > 0 ? trimmed : undefined };
};
