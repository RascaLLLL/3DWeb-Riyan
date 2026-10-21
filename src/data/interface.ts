export const cameraSensitivity = { min: 0.4, max: 2, step: 0.1, default: 1 } as const;

export function validCameraSensitivity(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(cameraSensitivity.max, Math.max(cameraSensitivity.min, value)) : cameraSensitivity.default;
}
