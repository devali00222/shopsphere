// src/modules/products/product.repository.ts and product.routes.ts
import { prisma } from '../../infra/prisma';
import type { CreateProductInput } from './product.schema';
// Same shape as categories - build these yourself now using the category
// list all products 
export async function listProducts() {
  const products = await prisma.product.findMany();
  if (!products) {
    return null
  }
  return products
}
// list products by product id
export async function listProductsByProductId(productId: string) {
  const products = await prisma.product.findMany({
    where: { id: productId },
  });
  if (!products) {
    return null
  }
  return products
}

// create a product
export async function createProduct(input: CreateProductInput) {
  const product = await prisma.product.create({ data: input });
  return product;
}

// update a product by id
export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  const product = await prisma.product.update({ where: { id }, data: input });
  return product;
}

// delete a product by id
export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({ where: { id } });
  return product;
}
