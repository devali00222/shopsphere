import {describe, it, expect} from 'vitest';
import request from 'supertest';
import {createApp} from '../src/app';

const app = createApp();

describe('POST /v1/categories',() => {
    it('creates a category with valid input', async () => {
        //  arrange
        const payload = {
            name: 'Test Category',
            slug: `test-category${Date.now()}`
        };
    //  act 
    const res = await request(app).post('/v1/categories').send(payload)
    //  assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(payload.name);
    expect(res.body.slug).toBe(payload.slug);
    })
    it('rejects an empty name with 400', async () => {
        //  arrange
        const payload = {
            name: '',
            slug: `test-category${Date.now()}`
        };
    //  act 
    const res = await request(app).post('/v1/categories').send(payload)
    //  assert
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');})
    })