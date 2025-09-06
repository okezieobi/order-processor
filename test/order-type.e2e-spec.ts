/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex';

describe('OrderTypeController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let createdOrderTypeId: string;

  const createDto = {
    name: 'Dine-In',
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
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /order-types - should create a new order type', () => {
    return request(app.getHttpServer())
      .post('/order-types')
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual(createDto.name);
        createdOrderTypeId = res.body.id;
      });
  });

  it('GET /order-types/:id - should return an order type by ID', () => {
    return request(app.getHttpServer())
      .get(`/order-types/${createdOrderTypeId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderTypeId);
        expect(res.body.name).toEqual(createDto.name);
      });
  });

  it('PUT /order-types/:id - should update an order type by ID', () => {
    const updateDto = { name: 'Take-Away' };
    return request(app.getHttpServer())
      .put(`/order-types/${createdOrderTypeId}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderTypeId);
        expect(res.body.name).toEqual(updateDto.name);
      });
  });

  it('GET /order-types - should return a paginated list of order types', () => {
    return request(app.getHttpServer())
      .get('/order-types?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /order-types/:id - should remove an order type by ID', () => {
    return request(app.getHttpServer())
      .delete(`/order-types/${createdOrderTypeId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /order-types/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/order-types/${createdOrderTypeId}`)
      .expect(404);
  });
});
