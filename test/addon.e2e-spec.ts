import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex from 'knex';

describe('AddonController (e2e)', () => {
  let app: INestApplication;
  let db: knex;
  let createdAddonId: string;
  let createdBrandId: string;

  const createBrandDto = {
    name: 'Test Brand for Addon',
  };

  const createAddonDto = {
    name: 'Extra Cheese',
    amount: 100,
    brandId: '',
  };

  beforeAll(async () => {
    db = knex(knexConfig);

    await db.raw(`DROP DATABASE IF EXISTS ${knexConfig.connection.database}`);
    await db.raw(`CREATE DATABASE ${knexConfig.connection.database}`);
    await db.destroy();

    db = knex(knexConfig);
    await db.migrate.latest();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a brand first, as addon has a brandId foreign key
    const brandRes = await request(app.getHttpServer())
      .post('/brands')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /addons/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/addons/${createdAddonId}`)
      .expect(404);
  });
});
