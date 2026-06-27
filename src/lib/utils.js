/**
 * Custom class merging utility.
 * Combines conditional class names into a single clean string.
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
