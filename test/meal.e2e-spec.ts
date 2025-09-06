/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex';

describe('MealController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let createdMealId: string;
  let createdBrandId: string;

  const createBrandDto = {
    name: 'Test Brand for Meal',
  };

  const createMealDto = {
    name: 'Burger',
    active: true,
    amount: 1000,
    brandId: '',
  };

  beforeAll(async () => {
    db = knex(knexConfig);

    const dbName = (knexConfig.connection as { database: string }).database;

    await db.raw(`DROP DATABASE IF EXISTS ${dbName}`);
    await db.raw(`CREATE DATABASE ${dbName}`);
    await db.destroy();

    db = knex(knexConfig);
    await db.migrate.latest();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a brand first, as meal has a brandId foreign key
    const brandRes = await request(app.getHttpServer())
      .post('/brands')
      .send(createBrandDto);
    createdBrandId = brandRes.body.id;
    createMealDto.brandId = createdBrandId;
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /meals - should create a new meal', () => {
    return request(app.getHttpServer())
      .post('/meals')
      .send(createMealDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual(createMealDto.name);
        expect(res.body.amount).toEqual(createMealDto.amount);
        expect(res.body.brandId).toEqual(createdBrandId);
        createdMealId = res.body.id;
      });
  });

  it('GET /meals/:id - should return a meal by ID', () => {
    return request(app.getHttpServer())
      .get(`/meals/${createdMealId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdMealId);
        expect(res.body.name).toEqual(createMealDto.name);
      });
  });

  it('PUT /meals/:id - should update a meal by ID', () => {
    const updateDto = { name: 'Cheeseburger', amount: 1200 };
    return request(app.getHttpServer())
      .put(`/meals/${createdMealId}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdMealId);
        expect(res.body.name).toEqual(updateDto.name);
        expect(res.body.amount).toEqual(updateDto.amount);
      });
  });

  it('GET /meals - should return a paginated list of meals', () => {
    return request(app.getHttpServer())
      .get('/meals?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /meals/:id - should remove a meal by ID', () => {
    return request(app.getHttpServer())
      .delete(`/meals/${createdMealId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /meals/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/meals/${createdMealId}`)
      .expect(404);
  });
});
