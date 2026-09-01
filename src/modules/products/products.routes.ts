import { Router, Request, Response } from 'express';
import { validate } from '../../middleware/validate';
import { createProductSchema, ListProductsQueryInput, listProductsQuerySchema, updateProductSchema } from './product.schema';
import * as repo from './product.repository';
import asyncHandler from '../../middleware/asyncHandler';
import { BadRequestError, NotFoundError } from '../../infra/errors';
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
    throw new BadRequestError('Product ID is required');
  }
  const product = await repo.listProductsByProductId(req.params.id);
  if (!product) {
    throw new NotFoundError('Product');
  }
  return res.status(200).json(product);
}));

// GET /category/categories - list products by category ID.
productRouter.get('/category/categories', validate(listProductsQuerySchema, "query"), asyncHandler(async (req: Request, res: Response) => {
  const data = {
    categoryId: req.query.categoryId,
    limit: req.query.limit,
    page: req.query.page,
  };
  const products = await repo.listProductsByCategoryId(data as unknown as ListProductsQueryInput);
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
    throw new BadRequestError('Product ID is required');
  }
  const product = await repo.updateProduct(req.params.id, req.body);
  return res.status(200).json(product);
}));

// DELETE /:id - delete a product by ID.
productRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new BadRequestError('Product ID is required');
  }
  const product = await repo.deleteProduct(req.params.id);
  return res.status(200).json(product);
}));