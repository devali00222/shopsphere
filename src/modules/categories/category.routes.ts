// src/modules/categories/category.routes.ts
import { Router, Request, Response } from 'express';
import { validate } from '../../middleware/validate';
import { createCategorySchema, updateCategorySchema } from './category.schema';
import * as repo from './category.repository';
import asyncHandler from '../../middleware/asyncHandler';
import { BadRequestError, NotFoundError } from '../../infra/errors';

export const categoryRouter = Router();

// GET / - list all. 
categoryRouter.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const categories = await repo.listCategories();
  return res.status(200).json(categories);
}));

// GET /:id - get one.
categoryRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestError('Category ID is required');
  }
  const category = await repo.getCategoryById(req.params.id);
  if (!category) {
    throw new NotFoundError('Category');
  }
  return res.status(200).json(category);
}));

// POST / - validate(createCategorySchema) as middleware, then create.

categoryRouter.post('/', validate(createCategorySchema), asyncHandler(async (req: Request, res: Response) => {
  const category = await repo.createCategory(req.body);
  return res.status(201).json(category);
}));

// PUT /:id - validate(updateCategorySchema), then update.
categoryRouter.put('/:id', validate(updateCategorySchema), asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestError('Category ID is required');
  }
  if (!req.body.name && !req.body.slug) {
    throw new BadRequestError('No data provided for update');
  }
  const category = await repo.updateCategory(req.params.id, req.body);
  return res.status(200).json(category);
}));

// DELETE /:id - what status code, and does the response have a body?
categoryRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestError('Category ID is required');
  }
  const category = await repo.deleteCategory(req.params.id);
  return res.status(200).json(category);
}));