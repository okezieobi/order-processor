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

    // Create dependencies for Order
    const userRes = await request(app.getHttpServer())
      .post('/users/signup')
      .send(createUserDto);
    createdUserId = userRes.body.id;

    const calculatedOrderRes = await request(app.getHttpServer())
      .post('/calculated-orders')
      .send(createCalculatedOrderDto);
    createdCalculatedOrderId = calculatedOrderRes.body.id;

    const orderTypeRes = await request(app.getHttpServer())
      .post('/order-types')
      .send(createOrderTypeDto);
    createdOrderTypeId = orderTypeRes.body.id;

    createOrderDto.userId = createdUserId;
    createOrderDto.calculatedOrderId = createdCalculatedOrderId;
    createOrderDto.orderTypeId = createdOrderTypeId;
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /orders - should create a new order', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.userId).toEqual(createOrderDto.userId);
        createdOrderId = res.body.id;
      });
  });

  it('GET /orders/:id - should return an order by ID', () => {
    return request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.userId).toEqual(createOrderDto.userId);
      });
  });

  it('PUT /orders/:id - should update an order by ID', () => {
    const updateDto = { paid: true };
    return request(app.getHttpServer())
      .put(`/orders/${createdOrderId}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdOrderId);
        expect(res.body.paid).toEqual(updateDto.paid);
      });
  });

  it('GET /orders - should return a paginated list of orders', () => {
    return request(app.getHttpServer())
      .get('/orders?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  describe('POST /orders/:id/process', () => {
    it('should accept an order', () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=accept`)
        .expect(200)
        .expect((res) => {
          expect(res.body.kitchenAccepted).toEqual(true);
          expect(res.body.kitchenVerifiedTime).toBeDefined();
        });
    });

    it('should prepare an order', () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=prepare`)
        .expect(200)
        .expect((res) => {
          expect(res.body.kitchenPrepared).toEqual(true);
          expect(res.body.kitchenCompletedTime).toBeDefined();
        });
    });

    it('should dispatch an order', () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=dispatch`)
        .expect(200)
        .expect((res) => {
          expect(res.body.kitchenDispatched).toEqual(true);
          expect(res.body.kitchenDispatchedTime).toBeDefined();
        });
    });

    it('should complete an order', () => {
      return request(app.getHttpServer())
        .post(`/orders/${createdOrderId}/process?action=complete`)
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
        .send(createOrderDto);
      const newOrderId = newOrderRes.body.id;

      return request(app.getHttpServer())
        .post(`/orders/${newOrderId}/process?action=cancel`)
        .expect(200)
        .expect((res) => {
          expect(res.body.cancelled).toEqual(true);
        });
    });
  });

  it('DELETE /orders/:id - should remove an order by ID', () => {
    return request(app.getHttpServer())
      .delete(`/orders/${createdOrderId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /orders/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .expect(404);
  });
});
