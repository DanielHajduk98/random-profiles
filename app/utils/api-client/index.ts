import { z, ZodError } from "zod";
import { ProfileSchema, type Profile } from "../../../lib/types/profile-schema";
import { isRecord } from "#server/utils/type-guards";

export type ApiClientErrorType =
  | "network"
  | "not-found"
  | "validation"
  | "unknown";

export class ApiClientError extends Error {
  readonly type: ApiClientErrorType;
  readonly statusCode?: number;
  readonly details?: unknown;

  constructor(
    type: ApiClientErrorType,
    message: string,
    options?: { statusCode?: number; details?: unknown },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.type = type;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
  }
}

type ApiFetchOptions = {
  query?: Record<string, string | number | undefined>;
};

export type GetProfilesParams = {
  count?: number;
  query?: string;
};

const getErrorStatusCode = (error: Record<string, unknown>): number | undefined => {
  if (typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if (typeof error.status === "number") {
    return error.status;
  }

  return undefined;
};

const getErrorMessage = (error: Record<string, unknown>): string => {
  if (typeof error.statusMessage === "string") {
    return error.statusMessage;
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  return "Request failed";
};

const normalizeError = (error: unknown): ApiClientError => {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ApiClientError("validation", "Response validation failed", {
      details: z.treeifyError(error)
    });
  }

  if (error instanceof TypeError) {
    return new ApiClientError("network", "Network error");
  }

  if (isRecord(error)) {
    const statusCode = getErrorStatusCode(error);
    const message = getErrorMessage(error);

    if (statusCode === 404) {
      return new ApiClientError("not-found", message, { statusCode });
    }

    if (statusCode === 400) {
      return new ApiClientError("validation", message, { statusCode });
    }

    if (typeof statusCode === "number") {
      return new ApiClientError("unknown", message, { statusCode });
    }
  }

  return new ApiClientError("unknown", "Unexpected error");
};

const assertValidProfiles = (data: unknown): Profile[] => {
  const validation = ProfileSchema.array().safeParse(data);
  if (!validation.success) {
    throw validation.error;
  }

  return validation.data;
};

const assertValidProfile = (data: unknown): Profile => {
  const validation = ProfileSchema.safeParse(data);
  if (!validation.success) {
    throw validation.error;
  }

  return validation.data;
};

export const getProfiles = async (
  params?: GetProfilesParams,
): Promise<Profile[]> => {
  const query: ApiFetchOptions["query"] = {
    count: params?.count,
    q: params?.query,
  };

  try {
    const response = await $fetch<unknown>("/api/profiles", { query });
    return assertValidProfiles(response);
  } catch (error) {
    throw normalizeError(error);
  }
};

export const getProfileById = async (
  id: string,
): Promise<Profile> => {
  try {
    const encodedId = encodeURIComponent(id);
    const response = await $fetch<unknown>(`/api/profile/${encodedId}`);
    return assertValidProfile(response);
  } catch (error) {
    throw normalizeError(error);
  }
};
