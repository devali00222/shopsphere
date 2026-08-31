// src/modules/categories/category.repository.ts
import { prisma } from '../../infra/prisma';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema';

// list all categories
export async function listCategories() {
    const categories = await prisma.category.findMany();
    if(!categories){
        return null
    }
    return categories;
}

// get one by id — return null if not found 
export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if(!category){
    return null
  }
  return category;
}

//  create. Postgres will reject a duplicate name/slug (unique
// constraint from 1.2) — catch that specific Prisma error (code P2002) and
// re-throw as your ConflictError so the API returns 409, not a raw 500.
export async function createCategory(input: CreateCategoryInput) {
    const category = await prisma.category.create({ data: input });
    if(!category){
        return null
    }
    return category;
}

// update by id
export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const data: Record<string, string> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined) data.slug = input.slug;
  const category = await prisma.category.update({ where: { id }, data });
  if(!category){
    return null
  }
  return category;
}

// delete by id.

export async function deleteCategory(id: string) {
  const category = await prisma.category.delete({ where: { id } });
  return category;
}