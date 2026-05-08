export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function generateId() {
  return crypto.randomUUID();
}
