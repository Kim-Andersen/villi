export function parseId<T extends number | number>(value: string): T {
  return parseInt(value) as T;
}