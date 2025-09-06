/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // Changed import
import { AppModule } from './../src/app.module';
import { knexConfig } from '../src/infrastructure/database/knex.config';
import knex, { Knex } from 'knex'; // Added Knex import

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let db: Knex; // Changed type to Knex

  beforeAll(async () => {
    // Connect to the database defined in knexConfig
    db = knex(knexConfig);

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

  const user = {
    email: `test+${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  };

  const adminUser = {
    email: `admin+${Date.now()}@example.com`,
    password: 'adminpassword',
    firstName: 'Admin',
    lastName: 'User',
  };

  let userToken: string;
  let adminToken: string;

  describe('POST /users/signup', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send(user)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toEqual(user.email);
          expect(res.body.firstName).toEqual(user.firstName);
          expect(res.body.lastName).toEqual(user.lastName);
          expect(res.body.roles).toEqual(['users']);
          expect(res.body.password_hash).toBeUndefined(); // password_hash should not be returned
        });
    });

    it('should not register a user with existing email', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .send(user)
        .expect(409) // Conflict
        .expect((res) => {
          expect(res.body.message).toEqual(
            'User with this email already exists',
          );
        });
    });
  });

  describe('POST /users/signup-admin', () => {
    it('should register a new admin user', () => {
      return request(app.getHttpServer())
        .post('/users/signup-admin')
        .send(adminUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toEqual(adminUser.email);
          expect(res.body.roles).toEqual(['users', 'admins']);
        });
    });
  });

  describe('POST /users/login', () => {
    it('should login a user and return an access token', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({ email: user.email, password: user.password })
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          userToken = res.body.accessToken;
        });
    });

    it('should login an admin user and return an access token', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({ email: adminUser.email, password: adminUser.password })
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          adminToken = res.body.accessToken;
        });
    });

    it('should not login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({ email: user.email, password: 'wrongpassword' })
        .expect(401) // Unauthorized
        .expect((res) => {
          expect(res.body.message).toEqual('Invalid credentials');
        });
    });
  });

  describe('GET /users/profile', () => {
    it('should return user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toEqual(user.email);
          expect(res.body.firstName).toEqual(user.firstName);
          expect(res.body.lastName).toEqual(user.lastName);
          expect(res.body.password_hash).toBeUndefined(); // password_hash should not be returned
        });
    });

    it('should return admin profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toEqual(adminUser.email);
          expect(res.body.firstName).toEqual(adminUser.firstName);
          expect(res.body.lastName).toEqual(adminUser.lastName);
          expect(res.body.roles).toEqual(['users', 'admins']);
        });
    });

    it('should not return profile without token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .expect(401) // Unauthorized
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });

    it('should not return profile with invalid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401) // Unauthorized
        .expect((res) => {
          expect(res.body.message).toEqual('Unauthorized');
        });
    });
  });
});
