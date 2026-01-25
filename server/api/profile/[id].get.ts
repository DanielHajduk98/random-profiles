import { createError, defineEventHandler } from "h3";
import { ProfileSchema } from "~~/lib/types/profile-schema";
import { getProfileCatalog } from "#server/utils/profile-catalog";

const getProfileId = (event: { context: { params?: Record<string, string> } }) => {
  const id = event.context.params?.id;

  if (typeof id !== "string" || id.trim().length === 0) {
    return undefined;
  }

  return id;
};

export default defineEventHandler((event) => {
  const id = getProfileId(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

	const catalog = getProfileCatalog();
	const profile = catalog.find((item) => item.id === id);

	if (!profile) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not Found",
		});
	}

	const validation = ProfileSchema.safeParse(profile);
	if (!validation.success) {
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
		});
	}

	return validation.data;
});
