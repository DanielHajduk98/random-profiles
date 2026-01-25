import { ProfileSchema, type Profile } from "~~/lib/types/profile-schema";
import { generateProfile } from "#server/utils/profile-generator";

const PROFILE_CATALOG_SIZE = 2000;
const PROFILE_CATALOG_SEED = "profile-catalog-v1";

let cachedCatalog: Profile[] | null = null;

const buildCatalog = (): Profile[] => {
  const catalog: Profile[] = [];
  const seenIds = new Set<string>();

  for (let index = 0; index < PROFILE_CATALOG_SIZE; index += 1) {
    const id = `profile-${index + 1}`;
    const profile = generateProfile({
      id,
      seed: `${PROFILE_CATALOG_SEED}-${index + 1}`,
    });

    if (seenIds.has(profile.id)) {
      throw new Error(`Duplicate profile id generated: ${profile.id}`);
    }

    seenIds.add(profile.id);
    catalog.push(ProfileSchema.parse(profile));
  }

  return catalog;
};

export const getProfileCatalog = (): Profile[] => {
  if (!cachedCatalog) {
    cachedCatalog = buildCatalog();
  }

  return cachedCatalog;
};

export { PROFILE_CATALOG_SIZE };
