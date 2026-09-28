export function clx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function normaliseString(text: string | undefined): string {
  return (text ?? '').trim().toLowerCase();
}

export function trimString(text: string | undefined): string {
  return (text ?? '').trim();
}

export function trimToUndefined(text: string | undefined): string | undefined {
  const value = trimString(text);
  return value ? value : undefined;
}

export function isSameNormalisedString(a: string | undefined, b: string | undefined): boolean {
  return normaliseString(a) === normaliseString(b);
}
