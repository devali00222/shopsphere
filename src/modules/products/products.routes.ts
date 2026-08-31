import { Router, Request, Response } from 'express';
import { validate } from '../../middleware/validate';
import { createProductSchema, listProductsQuerySchema, updateProductSchema } from './product.schema';
import * as repo from './product.repository';
import asyncHandler from '../../middleware/asyncHandler';
import { NotFoundError } from '../../infra/errors';
import { logger } from '../../infra/logger';

export const productRouter = Router();

// GET / - list all products.
productRouter.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const products = await repo.listProducts();
  if (!products) {
    throw new NotFoundError('Products not found');
  }
  return res.status(200).json(products);
}));

// GET /:id - get one product by ID.
productRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Bad Request', message: 'Product ID is required' });
  }
  const product = await repo.listProductsByProductId(req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  return res.status(200).json(product);
}));

// GET /:categoryId - list products by category ID.
productRouter.get('/category/:categoryId', validate(listProductsQuerySchema), asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Listing products for category ID: ${req.params.categoryId}`);
  if (!req.params.categoryId) {
    return res.status(400).json({ error: 'Bad Request', message: 'Category ID is required' });
  }
  const data = {
    categoryId: req.params.categoryId,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    page: req.query.page ? Number(req.query.page) : 1,
  };
  const products = await repo.listProductsByCategoryId(data);
  return res.status(200).json(products);
}));

// POST / - create a new product.
productRouter.post('/', validate(createProductSchema), asyncHandler(async (req: Request, res: Response) => {
  const product = await repo.createProduct(req.body);
  return res.status(201).json(product);
}));

// PUT /:id - update a product by ID.
productRouter.put('/:id', validate(updateProductSchema), asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Bad Request', message: 'Product ID is required' });
  }
  const existingProduct = await repo.listProductsByProductId(req.params.id);
  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }
  const product = await repo.updateProduct(req.params.id, req.body);
  return res.status(200).json(product);
}));

// DELETE /:id - delete a product by ID.
productRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Bad Request', message: 'Product ID is required' });
  }
  const existingProduct = await repo.listProductsByProductId(req.params.id);
  if (!existingProduct) {
    throw new NotFoundError('Product not found');
  }
  const product = await repo.deleteProduct(req.params.id);
  return res.status(200).json(product);
}));