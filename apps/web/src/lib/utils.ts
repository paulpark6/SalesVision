// Minimal utility helpers used across the UI

// Join class names, ignoring falsy values
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

