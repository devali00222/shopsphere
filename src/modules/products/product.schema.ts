import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Product name must be at least 3 characters long',
    })
    .max(100, {
      message: 'Product name must be at most 100 characters long',
    }),

  description: z
    .string()
    .min(10, {
      message: 'Product description must be at least 10 characters long',
    })
    .max(1000, {
      message: 'Product description must be at most 1000 characters long',
    }),

  priceCents: z
    .number()
    .int()
    .positive({
      message: 'Price must be a positive integer in cents',
    }),

  categoryId: z
    .string()
    .uuid({
      message: 'Category ID must be a valid UUID',
    }),
});


export const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Product name must be at least 3 characters long',
    })
    .max(100, {
      message: 'Product name must be at most 100 characters long',
    }).optional(),

  description: z
    .string()
    .min(10, {
      message: 'Product description must be at least 10 characters long',
    })
    .max(1000, {
      message: 'Product description must be at most 1000 characters long',
    }).optional(),

  priceCents: z
    .number()
    .int()
    .positive({
      message: 'Price must be a positive integer in cents',
    }).optional(),

  categoryId: z
    .string()
    .uuid({
      message: 'Category ID must be a valid UUID',
    }).optional(),
});
export const listProductsQuerySchema = z.object({
  categoryId: z
    .string()
    .uuid(),

  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  page: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQueryInput = z.infer<typeof listProductsQuerySchema>;