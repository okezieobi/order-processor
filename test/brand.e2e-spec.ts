/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex';

describe('BrandController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let createdBrandId: string;
  let adminToken: string;

  const createDto = {
    name: 'Test Brand',
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

    // create a shared admin used by read/list tests
    const sharedAdmin = {
      email: `shared_admin+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(sharedAdmin)
      .expect(201);
    const sharedLogin = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: sharedAdmin.email, password: sharedAdmin.password })
      .expect(201);
    adminToken = sharedLogin.body.accessToken as string;
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /brands - should create a new brand', async () => {
    // create and login admin
    const admin = {
      email: `admin+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(admin)
      .expect(201);
    const loginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    const adminToken = loginRes.body.accessToken as string;

    return request(app.getHttpServer())
      .post('/brands')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual(createDto.name);
        createdBrandId = res.body.id;
      });
  });

  it('GET /brands/:id - should return a brand by ID', () => {
    return request(app.getHttpServer())
  .get(`/brands/${createdBrandId}`)
  .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdBrandId);
        expect(res.body.name).toEqual(createDto.name);
      });
  });

  it('PUT /brands/:id - should update a brand by ID', async () => {
    const updateDto = { name: 'Updated Brand' };
    // reuse admin token from creation step by creating new admin and logging in (keeps tests hermetic)
    const admin = {
      email: `admin2+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(admin)
      .expect(201);
    const loginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    const adminToken = loginRes.body.accessToken as string;

    return request(app.getHttpServer())
      .put(`/brands/${createdBrandId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdBrandId);
        expect(res.body.name).toEqual(updateDto.name);
      });
  });

  it('GET /brands - should return a paginated list of brands', async () => {
    // list as admin
    const admin = {
      email: `admin3+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(admin)
      .expect(201);
    const loginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    const adminToken = loginRes.body.accessToken as string;

    return request(app.getHttpServer())
      .get('/brands?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /brands/:id - should remove a brand by ID', async () => {
    const admin = {
      email: `admin4+${Date.now()}@example.com`,
      password: 'adminpassword',
      firstName: 'Admin',
      lastName: 'User',
    };
    await request(app.getHttpServer())
      .post('/users/signup-admin')
      .send(admin)
      .expect(201);
    const loginRes = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201);
    const adminToken = loginRes.body.accessToken as string;

    return request(app.getHttpServer())
      .delete(`/brands/${createdBrandId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /brands/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/brands/${createdBrandId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
