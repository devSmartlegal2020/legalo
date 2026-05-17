import escapeStringRegexp from 'escape-string-regexp';

/**
 * Safely escapes user input to prevent NoSQL injection via regex
 * and ReDoS attacks.
 */
export const escapeRegex = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return escapeStringRegexp(input.trim());
};

/**
 * Builds a safe MongoDB regex query from user search input.
 */
export const buildSearchQuery = (
  search: string,
  fields: string[]
): { $or: { [key: string]: { $regex: string; $options: string } }[] } | null => {
  const escaped = escapeRegex(search);
  if (!escaped) return null;
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: escaped, $options: 'i' },
    })),
  };
};
