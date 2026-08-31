import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(3, { message: 'Category name must be at least 3 characters long' }).max(50, { message: 'Category name must be at most 50 characters long' }),
    slug: z.string().min(3, { message: 'Category slug must be at least 3 characters long' }).max(50, { message: 'Category slug must be at most 50 characters long' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Category slug must be a valid URL-friendly string (lowercase letters, numbers, and hyphens only)' }),
})
export const updateCategorySchema = z.object({
    name: z.string().min(3, { message: 'Category name must be at least 3 characters long' }).max(50, { message: 'Category name must be at most 50 characters long' }).optional(),
    slug: z.string().min(3, { message: 'Category slug must be at least 3 characters long' }).max(50, { message: 'Category slug must be at most 50 characters long' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Category slug must be a valid URL-friendly string (lowercase letters, numbers, and hyphens only)' }).optional(),
})
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;