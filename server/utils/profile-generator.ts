import { faker } from "@faker-js/faker";
import { ProfileSchema, type Profile } from "~~/lib/types/profile-schema";
import { isNumber } from "#server/utils/type-guards";

const AVATAR_SIZE = 256;

type ProfileGeneratorOptions = {
  id?: string;
  seed?: number | string;
};

const toSeedNumber = (value: number | string): number => {
  if (isNumber(value)) {
    return value;
  }

  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return hash >>> 0;
};

const buildAvatarUrl = (identifier: string): string =>
  `https://testingbot.com/free-online-tools/random-avatar/${AVATAR_SIZE}?u=${encodeURIComponent(
    identifier,
  )}`;

export const generateProfile = (
  options: ProfileGeneratorOptions = {},
): Profile => {
  let seedValue: number | undefined;

  if (options.seed !== undefined) {
    seedValue = toSeedNumber(options.seed);
  } else if (options.id) {
    seedValue = toSeedNumber(options.id);
  }

  if (seedValue !== undefined) {
    faker.seed(seedValue);
  }

  const id = options.id ?? faker.string.uuid();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  const rawPhone = faker.phone.number({ style: "international" });
  const phone = (rawPhone.startsWith("+") ? rawPhone : `+${rawPhone}`).replace(
    /[^\d+]/g,
    "",
  );

  const profile = {
    id,
    name,
    email: faker.internet.email({ firstName, lastName }),
    avatarUrl: buildAvatarUrl(id),
    age: faker.number.int({ min: 0, max: 100 }),
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    phone,
    address: faker.location.streetAddress(),
    bio: faker.person.bio(),
  };

  return ProfileSchema.parse(profile);
};
