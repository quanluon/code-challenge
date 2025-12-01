import { Prisma, Resource } from '@prisma/client';
import { deserializeTags, serializeTags } from '../utils/tagSerializer';

export interface ResourcePayload {
  name?: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
}

export type ResourceResponse = Omit<Resource, 'tagsCsv'> & { tags: string[] };

export const buildCreateData = ({
  name = '',
  description = '',
  tags = [],
  isActive = true,
}: ResourcePayload): Prisma.ResourceCreateInput => ({
  name: name.trim(),
  description,
  tagsCsv: serializeTags(tags),
  isActive,
});

export const buildUpdateData = ({
  name,
  description,
  tags,
  isActive,
}: ResourcePayload): Prisma.ResourceUpdateInput => {
  const data: Prisma.ResourceUpdateInput = {};
  if (typeof name === 'string' && name.trim()) {
    data.name = name.trim();
  }
  if (typeof description === 'string') {
    data.description = description;
  }
  if (Array.isArray(tags)) {
    data.tagsCsv = serializeTags(tags);
  }
  if (typeof isActive === 'boolean') {
    data.isActive = isActive;
  }
  return data;
};

export const toResourceResponse = ({ tagsCsv, ...resource }: Resource): ResourceResponse => ({
  ...resource,
  tags: deserializeTags(tagsCsv),
});

