import { eventHandler } from "h3";
import { ProfileSchema } from "~~/lib/types/profile-schema";
import { getProfileCatalog } from "#server/utils/profile-catalog";
import { buildErrorResponse } from "#server/utils/profile-query-validation";
import { setStatus } from "#server/utils/response-status";

const getProfileId = (event: { context: { params?: Record<string, string> } }) => {
  const id = event.context.params?.id;

  if (typeof id !== "string" || id.trim().length === 0) {
    return undefined;
  }

  return id;
};

export default eventHandler((event) => {
  const id = getProfileId(event);
  if (!id) {
    setStatus(event, 404, "Not Found");
    return buildErrorResponse("PROFILE_NOT_FOUND", "Profile not found");
  }

  try {
    const catalog = getProfileCatalog();
    const profile = catalog.find((item) => item.id === id);

    if (!profile) {
      setStatus(event, 404, "Not Found");
      return buildErrorResponse("PROFILE_NOT_FOUND", "Profile not found");
    }

    const validation = ProfileSchema.safeParse(profile);
    if (!validation.success) {
      setStatus(event, 500, "Internal Server Error");
      return buildErrorResponse(
        "INTERNAL_ERROR",
        "Unexpected error while loading profile",
      );
    }

    setStatus(event, 200, "OK");
    return validation.data;
  } catch (error) {
    setStatus(event, 500, "Internal Server Error");
    return buildErrorResponse(
      "INTERNAL_ERROR",
      "Unexpected error while loading profile",
    );
  }
});
