import { Prisma } from '@prisma/client';
import { wrapTag } from './tagSerializer';

export interface ResourceListQuery {
  search?: string;
  tag?: string | string[];
  isActive?: string;
}

const normalizeTags = (tag?: string | string[]): string[] => {
  if (!tag) {
    return [];
  }
  return Array.isArray(tag) ? tag : [tag];
};

export const buildResourceFilters = ({
  search = '',
  tag,
  isActive,
}: ResourceListQuery): Prisma.ResourceWhereInput => {
  const andFilters: Prisma.ResourceWhereInput[] = [];

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    andFilters.push({
      name: {
        contains: trimmedSearch,
      },
    });
  }

  if (typeof isActive === 'string') {
    andFilters.push({ isActive: isActive === 'true' });
  }

  const tags = normalizeTags(tag).filter(Boolean);
  if (tags.length) {
    andFilters.push({
      OR: tags.map((tagValue) => ({
        tagsCsv: {
          contains: wrapTag(tagValue),
        },
      })),
    });
  }

  return andFilters.length ? { AND: andFilters } : {};
};

