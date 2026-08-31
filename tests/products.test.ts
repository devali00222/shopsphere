import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('POST /v1/products', () => {
    it('creates a product with valid input', async () => {
        //  arrange
        const payload = {
            name: 'Test Product',
            description: 'This is a test product description',
            priceCents: 1000,
            categoryId: '88845823-a9a0-4176-b252-8dbd1afd751f'
        };
        //  act 
        const res = await request(app).post('/v1/products').send(payload)
        //  assert
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(payload.name);
        expect(res.body.description).toBe(payload.description);
        expect(res.body.priceCents).toBe(payload.priceCents);
        expect(res.body.categoryId).toBe(payload.categoryId);
    })
    it('rejects an empty name with 400', async () => {
        //  arrange
        const payload = {
            name: '',
            description: 'This is a test product description',
            priceCents: 1000,
            categoryId: '88845823-a9a0-4176-b252-8dbd1afd751f'
        };
        //  act 
        const res = await request(app).post('/v1/products').send(payload)
        //  assert
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('message');
    })
})