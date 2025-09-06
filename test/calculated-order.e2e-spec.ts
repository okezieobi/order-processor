/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex';

describe('CalculatedOrderController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let createdOrderId: string;

  const createDto = {
    totalAmount: 1000,
    freeDelivery: false,
    deliveryFee: 500,
    serviceCharge: 100,
    addressDetails: { street: '123 Test St', city: 'Testville' },
    lat: '1.2345',
    lng: '6.7890',
    pickup: false,
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

  it('POST /calculated-orders - should create a new calculated order', () => {
    return request(app.getHttpServer())
      .post('/calculated-orders')
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.totalAmount).toEqual(createDto.totalAmount);
        createdOrderId = res.body.id;
      });
  });

  it('GET /calculated-orders/:id - should return a calculated order by ID', () => {
    return request(app.getHttpServer())
      .get(`/calculated-orders/${createdOrderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.totalAmount).toEqual(createDto.totalAmount);
      });
  });

  it('PUT /calculated-orders/:id - should update a calculated order by ID', () => {
    const updateDto = { totalAmount: 2000, freeDelivery: true };
    return request(app.getHttpServer())
      .put(`/calculated-orders/${createdOrderId}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.totalAmount).toEqual(updateDto.totalAmount);
        expect(res.body.freeDelivery).toEqual(updateDto.freeDelivery);
      });
  });

  it('GET /calculated-orders - should return a paginated list of calculated orders', () => {
    return request(app.getHttpServer())
      .get('/calculated-orders?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /calculated-orders/:id - should remove a calculated order by ID', () => {
    return request(app.getHttpServer())
      .delete(`/calculated-orders/${createdOrderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /calculated-orders/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/calculated-orders/${createdOrderId}`)
      .expect(404);
  });
});
