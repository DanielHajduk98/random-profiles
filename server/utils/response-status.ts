import type { H3Event } from "h3";

export const setStatus = (
  event: H3Event,
  status: number,
  statusText: string,
) => {
  event.res.status = status;
  event.res.statusText = statusText;
};
