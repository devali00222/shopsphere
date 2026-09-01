// src/modules/categories/category.repository.ts
import { prisma } from '../../infra/prisma';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema';

// list all categories
export async function listCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

// get one by id — return null if not found 
export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  return category;
}


export async function createCategory(input: CreateCategoryInput) {
  const category = await prisma.category.create({ data: input });
  return category;
}

// update by id
export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const data: { name?: string; slug?: string } = {}
  if (input.name) {
    data['name'] = input.name;
  }
  if (input.slug) {
    data['slug'] = input.slug;
  }
  const category = await prisma.category.update(
    {
      where: { id },
      data: data
    });
  return category;
}

// delete by id.
export async function deleteCategory(id: string) {
  const category = await prisma.category.delete({ where: { id } });
  return category;
}