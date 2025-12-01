import { Router } from 'express';
import { prisma } from '../db';
import {
  ResourcePayload,
  buildCreateData,
  buildUpdateData,
  toResourceResponse,
} from '../models/resource.model';
import { buildResourceFilters } from '../utils/resourceFilters';

const RESOURCE_NOT_FOUND = 'Resource not found';
const RESOURCE_NAME_REQUIRED = 'Resource name is required';
const INVALID_RESOURCE_ID = 'Resource id must be a positive integer';

const parseId = (idParam: string): number | null => {
  const parsed = Number(idParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const ensureName = (name?: string): string | null => {
  if (typeof name !== 'string') {
    return null;
  }
  const normalized = name.trim();
  return normalized || null;
};

const formatResourcePayload = (body: ResourcePayload): ResourcePayload => {
  const { name, description, tags, isActive } = body;
  return {
    name,
    description,
    tags: Array.isArray(tags) ? tags : undefined,
    isActive,
  };
};

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const payload = formatResourcePayload(req.body);
    const normalizedName = ensureName(payload.name);
    if (!normalizedName) {
      return res.status(400).json({ message: RESOURCE_NAME_REQUIRED });
    }
    const resource = await prisma.resource.create({
      data: buildCreateData({ ...payload, name: normalizedName }),
    });
    return res.status(201).json(toResourceResponse(resource));
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filters = buildResourceFilters(req.query);
    const resources = await prisma.resource.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
    return res.json(resources.map(toResourceResponse));
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: INVALID_RESOURCE_ID });
    }
    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      return res.status(404).json({ message: RESOURCE_NOT_FOUND });
    }
    return res.json(toResourceResponse(resource));
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: INVALID_RESOURCE_ID });
    }
    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: RESOURCE_NOT_FOUND });
    }
    const payload = formatResourcePayload(req.body);
    const data = buildUpdateData(payload);
    if (!Object.keys(data).length) {
      return res.status(400).json({ message: 'No valid fields provided' });
    }
    const normalizedName = ensureName(payload.name);
    if (payload.name !== undefined && !normalizedName) {
      return res.status(400).json({ message: RESOURCE_NAME_REQUIRED });
    }
    if (normalizedName) {
      data.name = normalizedName;
    }
    const resource = await prisma.resource.update({
      where: { id },
      data,
    });
    return res.json(toResourceResponse(resource));
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: INVALID_RESOURCE_ID });
    }
    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: RESOURCE_NOT_FOUND });
    }
    await prisma.resource.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;