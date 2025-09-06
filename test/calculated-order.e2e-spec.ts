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
  let adminToken: string;

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
    // Connect to the database defined in knexConfig
    db = knex(knexConfig);

    // No need to drop/create database or run migrations here,
    // as the database is assumed to be managed by docker-compose
    // and migrations are run by the CI/CD pipeline.

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // create and login an admin to authenticate protected endpoints
    const admin = {
      email: `calc_admin+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(admin)
      .expect(201);
    const adminLogin = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    adminToken = adminLogin.body.accessToken as string;
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /calculated-orders - should create a new calculated order', async () => {
    return request(app.getHttpServer())
      .post('/calculated-orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.totalAmount).toEqual(createDto.totalAmount);
        createdOrderId = res.body.id;
      });
  });

  it('GET /calculated-orders/:id - should return a calculated order by ID', async () => {
    return request(app.getHttpServer())
      .get(`/calculated-orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.totalAmount).toEqual(createDto.totalAmount);
      });
  });

  it('PUT /calculated-orders/:id - should update a calculated order by ID', async () => {
    const updateDto = { totalAmount: 2000, freeDelivery: true };
    return request(app.getHttpServer())
      .put(`/calculated-orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.totalAmount).toEqual(updateDto.totalAmount);
        expect(res.body.freeDelivery).toEqual(updateDto.freeDelivery);
      });
  });

  it('GET /calculated-orders - should return a paginated list of calculated orders', async () => {
    return request(app.getHttpServer())
      .get('/calculated-orders?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /calculated-orders/:id - should remove a calculated order by ID', async () => {
    return request(app.getHttpServer())
      .delete(`/calculated-orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /calculated-orders/:id - should return 404 after deletion', async () => {
    return request(app.getHttpServer())
      .get(`/calculated-orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
