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

  const createDto = {
    name: 'Test Brand',
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

  it('POST /brands - should create a new brand', () => {
    return request(app.getHttpServer())
      .post('/brands')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdBrandId);
        expect(res.body.name).toEqual(createDto.name);
      });
  });

  it('PUT /brands/:id - should update a brand by ID', () => {
    const updateDto = { name: 'Updated Brand' };
    return request(app.getHttpServer())
      .put(`/brands/${createdBrandId}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(createdBrandId);
        expect(res.body.name).toEqual(updateDto.name);
      });
  });

  it('GET /brands - should return a paginated list of brands', () => {
    return request(app.getHttpServer())
      .get('/brands?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.total).toBeGreaterThan(0);
      });
  });

  it('DELETE /brands/:id - should remove a brand by ID', () => {
    return request(app.getHttpServer())
      .delete(`/brands/${createdBrandId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deleted).toEqual(true);
      });
  });

  it('GET /brands/:id - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/brands/${createdBrandId}`)
      .expect(404);
  });
});
