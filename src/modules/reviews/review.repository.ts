// src/modules/reviews/review.repository.ts
import { getDb } from '../../infra/mongo';
import type { Review } from './review.types';

const COLLECTION = 'reviews';

// Create a review and return the inserted document.
export async function createReview(
  review: Omit<Review, '_id'>,
): Promise<Review> {
  const collection = getDb().collection<Review>(COLLECTION);

  const result = await collection.insertOne(review);

  return {
    ...review,
    _id: result.insertedId.toString(),
  };
}

// Get reviews for a product, newest first, with pagination.
export async function getReviewsForProduct(
  productId: string,
  limit: number,
  skip: number,
): Promise<Review[]> {
  const collection = getDb().collection<Review>(COLLECTION);

  return collection
    .find({ productId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

// Index for filtering reviews by product and returning the newest reviews first.
export async function ensureReviewIndexes(): Promise<void> {
  const collection = getDb().collection<Review>(COLLECTION);

  await collection.createIndex({
    productId: 1,
    createdAt: -1,
  });
}