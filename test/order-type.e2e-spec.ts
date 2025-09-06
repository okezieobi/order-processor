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
  let adminToken: string;

  const createDto = {
    name: 'Dine-In',
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

    // create and login admin
    const admin = {
      email: `otype_admin+${Date.now()}@example.com`,
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

  it('POST /order-types - should create a new order type', () => {
    return request(app.getHttpServer())
      .post('/order-types')
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /order-types/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/order-types/${createdOrderTypeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
