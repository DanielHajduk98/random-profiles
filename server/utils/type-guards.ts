export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
  