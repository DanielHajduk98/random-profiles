import Fuse, { IFuseOptions } from "fuse.js";

import type { Profile } from "~~/lib/types/profile-schema";

const PROFILE_SEARCH_KEYS = [
  "name",
  "email",
  "phone",
  "company",
  "jobTitle",
  "address",
] as const;

type ProfileSearchOptions = {
  query?: string;
  count: number;
};

type CachedFuse = {
  catalog: Profile[];
  fuse: Fuse<Profile>;
};

let cachedFuse: CachedFuse | null = null;

const getFuseInstance = (catalog: Profile[]): Fuse<Profile> => {
  if (cachedFuse?.catalog === catalog) {
    return cachedFuse.fuse;
  }

  const options: IFuseOptions<Profile> = {
    keys: [...PROFILE_SEARCH_KEYS],
    ignoreLocation: true,
    threshold: 0.3,
  };

  const fuse = new Fuse(catalog, options);
  cachedFuse = { catalog, fuse };
  return fuse;
};

export const searchProfiles = (
  catalog: Profile[],
  { query, count }: ProfileSearchOptions,
): Profile[] => {
  if (!query) {
    return catalog.slice(0, count);
  }

  const fuse = getFuseInstance(catalog);
  const results = fuse.search(query, { limit: count });

  return results.map((result) => result.item);
};
