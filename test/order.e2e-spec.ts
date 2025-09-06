/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let createdOrderId: string;
  let createdUserId: string;
  let createdCalculatedOrderId: string;
  let createdOrderTypeId: string;
  let userToken: string;
  let adminToken: string;

  const createUserDto = {
    email: 'order_test_user@example.com',
    password: 'password123',
    firstName: 'Order',
    lastName: 'User',
  };

  const createCalculatedOrderDto = {
    totalAmount: 1000,
    freeDelivery: false,
    deliveryFee: 500,
    serviceCharge: 100,
    addressDetails: { street: '123 Order St', city: 'Orderville' },
    lat: '1.2345',
    lng: '6.7890',
    pickup: false,
  };

  const createOrderTypeDto = {
    name: 'Delivery',
  };

  const createOrderDto = {
    userId: '',
    calculatedOrderId: '',
    orderTypeId: '',
    paid: false,
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

    // ensure a unique email for each test run to avoid "User with this email already exists"
    createUserDto.email = `order_test_user_${Date.now()}@example.com`;

    // Create dependencies for Order
    const userRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send(createUserDto);
    createdUserId = userRes.body.id;

    // login the created user to obtain token for owner-scoped operations
    const userLoginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: createUserDto.email, password: createUserDto.password })
      .expect(201);
    userToken = userLoginRes.body.accessToken as string;

    const calculatedOrderRes = await request(app.getHttpServer())
      .post('/calculated-orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createCalculatedOrderDto);
    createdCalculatedOrderId = calculatedOrderRes.body.id;

    const orderTypeRes = await request(app.getHttpServer())
      .post('/order-types')
      .send(createOrderTypeDto);
    createdOrderTypeId = orderTypeRes.body.id;

    // create an admin token for admin-only operations
    const admin = {
      email: `order_admin+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(admin)
      .expect(201);
    const adminLoginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    adminToken = adminLoginRes.body.accessToken as string;

    createOrderDto.userId = createdUserId;
    createOrderDto.calculatedOrderId = createdCalculatedOrderId;
    createOrderDto.orderTypeId = createdOrderTypeId;
    // prepared createOrderDto
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /orders - should create a new order', async () => {
    return request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createOrderDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.userId).toEqual(createOrderDto.userId);
        createdOrderId = res.body.id;
      });
  });

  it('GET /orders/:id - should return an order by ID', async () => {
    return request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.userId).toEqual(createOrderDto.userId);
      });
  });

  it('PUT /orders/:id - should update an order by ID', async () => {
    const updateDto = { paid: true };
    return request(app.getHttpServer())
      .put(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.paid).toEqual(updateDto.paid);
      });
  });

  it('GET /orders - should return a paginated list of orders', async () => {
    return request(app.getHttpServer())
      .get('/orders?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  describe('POST /orders/:id/process', () => {
    it('should accept an order', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=accept`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.kitchenAccepted).toEqual(true);
          expect(res.body.kitchenVerifiedTime).toBeDefined();
        });
    });

    it('should prepare an order', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=prepare`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.kitchenPrepared).toEqual(true);
          expect(res.body.kitchenCompletedTime).toBeDefined();
        });
    });

    it('should dispatch an order', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=dispatch`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.kitchenDispatched).toEqual(true);
          expect(res.body.kitchenDispatchedTime).toBeDefined();
        });
    });

    it('should complete an order', async () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=complete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toEqual(true);
          expect(res.body.completedTime).toBeDefined();
        });
    });

    it('should cancel an order', async () => {
      // Create a new order to cancel, as the previous one is completed
      const newOrderRes = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createOrderDto);
      const newOrderId = newOrderRes.body.id;

      return request(app.getHttpServer())
        .post(`/orders/${newOrderId}/process?action=cancel`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.cancelled).toEqual(true);
        });
    });
  });

  it('DELETE /orders/:id - should remove an order by ID', async () => {
    return request(app.getHttpServer())
      .delete(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /orders/:id - should return 404 after deletion', async () => {
    return request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
