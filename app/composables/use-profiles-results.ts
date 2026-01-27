import { computed, type Ref, unref } from "vue";
import { ApiClientError, getProfiles } from "../utils/api-client";
import type { Profile } from "../../lib/types/profile-schema";
import { normalizeQuery } from "../utils/search-query";

type UseProfilesResultsOptions = {
  count: number;
  query?: Ref<string> | string;
  resultsKey: string;
  skipEmpty?: boolean;
};

type UseProfilesResultsState = {
  profiles: Ref<Profile[]>;
  pending: Ref<boolean>;
  error: Ref<unknown>;
  errorMessage: Ref<string>;
  hasQuery: Ref<boolean>;
};

export const useProfilesResults = async (
  options: UseProfilesResultsOptions,
): Promise<UseProfilesResultsState> => {
  const normalizedQuery = computed(() =>
    normalizeQuery(unref(options.query ?? "")),
  );

  const shouldFetch = computed(
    () => !options.skipEmpty || normalizedQuery.value.length > 0,
  );

  const { data, pending, error } = await useAsyncData<Profile[]>(
    options.resultsKey,
    async () => {
      if (!shouldFetch.value) {
        return [];
      }

      return getProfiles({
        count: options.count,
        query: normalizedQuery.value || undefined,
      });
    },
    {
      watch: [normalizedQuery],
      default: () => [],
    },
  );

  const profiles = computed<Profile[]>(() => data.value ?? []);

  const errorMessage = computed(() => {
    if (!error.value) {
      return "";
    }

    if (error.value instanceof ApiClientError) {
      return error.value.message;
    }

    if (error.value instanceof Error) {
      return error.value.message;
    }

    return "Unexpected error";
  });

  const isPending = computed(
    () => shouldFetch.value && pending.value,
  );

  const hasQuery = computed(() => normalizedQuery.value.length > 0);

  return {
    profiles,
    pending: isPending,
    error,
    errorMessage,
    hasQuery,
  };
};
