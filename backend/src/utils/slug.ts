import slugify from 'slugify';

export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.(){}[\]\\/\\@#$%^&*]+/g,
  });
};

export const generateUniqueSlug = async (
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = generateSlug(text);
  let counter = 1;
  let uniqueSlug = slug;

  while (await checkExists(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};
