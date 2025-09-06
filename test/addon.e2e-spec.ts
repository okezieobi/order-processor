/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex';

describe('AddonController (e2e)', () => {
  let app: INestApplication;
  let db: Knex;
  let createdAddonId: string;
  let createdBrandId: string;
  let adminToken: string;

  const createBrandDto = {
    name: 'Test Brand for Addon',
  };

  const createAddonDto = {
    name: 'Extra Cheese',
    amount: 100,
    brandId: '',
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

    // Create a brand first, as addon has a brandId foreign key
    const admin = {
      email: `addon_admin+${Date.now()}@example.com`,
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

    const brandRes = await request(app.getHttpServer())
      .post('/brands')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createBrandDto);
    createdBrandId = brandRes.body.id;
    createAddonDto.brandId = createdBrandId;
  });

  afterAll(async () => {
    await app.close();
    await db.destroy();
  });

  it('POST /addons - should create a new addon', () => {
    return request(app.getHttpServer())
      .post('/addons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createAddonDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual(createAddonDto.name);
        expect(res.body.amount).toEqual(createAddonDto.amount);
        expect(res.body.brandId).toEqual(createdBrandId);
        createdAddonId = res.body.id;
      });
  });

  it('GET /addons/:id - should return an addon by ID', () => {
    return request(app.getHttpServer())
      .get(`/addons/${createdAddonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdAddonId);
        expect(res.body.name).toEqual(createAddonDto.name);
      });
  });

  it('PUT /addons/:id - should update an addon by ID', () => {
    const updateDto = { name: 'Double Cheese', amount: 150 };
    return request(app.getHttpServer())
      .put(`/addons/${createdAddonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdAddonId);
        expect(res.body.name).toEqual(updateDto.name);
        expect(res.body.amount).toEqual(updateDto.amount);
      });
  });

  it('GET /addons - should return a paginated list of addons', () => {
    return request(app.getHttpServer())
      .get('/addons?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /addons/:id - should remove an addon by ID', () => {
    return request(app.getHttpServer())
      .delete(`/addons/${createdAddonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /addons/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/addons/${createdAddonId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
