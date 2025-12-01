const TAG_SEPARATOR = ',';

const sanitizeTags = (tags: string[] = []): string[] =>
  tags.map((tag) => tag.trim()).filter(Boolean);

export const serializeTags = (tags: string[] = []): string => {
  const cleaned = sanitizeTags(tags);
  return cleaned.length ? `${TAG_SEPARATOR}${cleaned.join(TAG_SEPARATOR)}${TAG_SEPARATOR}` : '';
};

export const deserializeTags = (tagsCsv: string): string[] =>
  tagsCsv
    .split(TAG_SEPARATOR)
    .map((tag) => tag.trim())
    .filter(Boolean);

export const wrapTag = (tag: string): string => `${TAG_SEPARATOR}${tag.trim()}${TAG_SEPARATOR}`;

