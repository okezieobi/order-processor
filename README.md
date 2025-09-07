# Senior Backend Lead Test: Analysis and Architecture

This section provides an analysis of the existing codebase against the test requirements and outlines a proposed system architecture.

## TASK 1: Project Implementation Analysis

This section analyzes how the current project implements the requirements outlined in Task 1.

### 1. Setup

The project is built with NestJS and uses Objection.js with Knex for database management. The `knexfile.ts` and `package.json` confirm the use of a PostgreSQL database.

### 2. Data Modeling with Objection.js

Objection.js models for all required entities are located in `src/infrastructure/objection/models`. Each model, like `OrderModel` in `order.model.ts`, extends a `BaseModel` to ensure consistency.

### 3. CRUD Operations

The project implements a standard layered architecture. For each entity, there is a controller in `src/interfaces/http/controllers`, a service in `src/application/services`, and a repository in `src/infrastructure/objection/repositories`. This structure provides clear separation of concerns for handling CRUD operations.

### 4. DTOs and Validations

DTOs are defined in `src/interfaces/http/dto`. These DTOs use `class-validator` decorators for validation. For more complex scenarios, such as in the `OrderController`, a `JoiValidationPipe` is used with a custom schema.

### 5. Middleware and Utilities

A `RequestLoggerMiddleware` is implemented at `src/common/middleware/request-logger.middleware.ts` and is configured in `AppModule` to log all incoming requests.

### 6. Business Logic

The `OrderService` (`src/application/services/order.service.ts`) contains the `processOrder` method, which encapsulates the core business logic for processing an order. It coordinates with the repository layer to persist state changes and the events layer (`order-events.gateway.ts`) to emit real-time updates.

### 7. Testing

The project includes a suite of end-to-end tests in the `test/` directory (e.g., `order.e2e-spec.ts`). These tests cover the core functionality of the API endpoints.

-   **Continuous Integration**: The project is configured to run these tests automatically using GitHub Actions, as defined in `.github/workflows/node.js.yml`. The status of the latest test run is displayed by the "Node.js CI" badge at the top of this README, providing immediate feedback on the health of the codebase.

### Swagger Implementation

API documentation is provided using Swagger and is configured in `src/main.ts`. The UI is available at `/api`, and the controllers are decorated with `@ApiBody` and `@ApiResponse` to provide clear examples.

## TASK 2: System Architecture Design

This section outlines a high-level architecture for a large-scale, global order processing system.

### Architectural Goals

- **Scalability**: Handle millions of orders daily.
- **Resilience**: Tolerate failures and maintain high availability.
- **Maintainability**: Allow for independent development and deployment of components.

### High-Level Architecture

A microservices architecture is the most suitable approach to meet these goals. The main components would be:

- **API Gateway**: A single, unified entry point for all client applications. It handles routing, authentication, and rate limiting.
- **Load Balancers**: Distribute traffic across the available instances of each microservice, preventing any single instance from being a bottleneck.
- **Microservices**: The system would be decomposed into several independent services, each responsible for a specific business domain:
    - **Order Service**: Manages the entire lifecycle of an order.
    - **Kitchen Service**: Handles kitchen-specific logic, including order preparation and dispatch.
    - **User Service**: Manages user accounts, profiles, and authentication.
    - **Payment Service**: Integrates with payment providers to process transactions securely.
- **Message Broker (e.g., RabbitMQ, Kafka)**: Facilitates asynchronous communication between microservices. This decouples services and improves fault tolerance.
- **Distributed Cache (e.g., Redis)**: Caches frequently accessed data to reduce latency and database load.

### Data Storage

For a system of this scale, a single database would not be sufficient. Each microservice would own its data, and the data stores would be scaled independently. For the Order and Kitchen services, a sharded PostgreSQL database (sharded by `region` or `brand_id`) would allow for horizontal scaling. Read replicas would be used to handle high read volumes.

### Real-time Updates and Data Consistency

WebSockets would be used to provide real-time updates to clients. A dedicated WebSocket service would subscribe to events from the message broker and push updates to the relevant clients. To ensure data consistency across services, the Saga pattern would be used for distributed transactions.

### Resilience and Security

- **Resilience**: The system would be designed for high availability by running multiple instances of each service and database. Health checks and circuit breakers would be used to detect and isolate failures.
- **Security**: Security is a primary concern. The system would use JWT for authentication, similar to the implementation in `jwt.strategy.ts`. Role-based access control (RBAC), as seen in `roles.guard.ts`, would be used to enforce authorization. All sensitive data would be encrypted both in transit and at rest.

## Bonus Tasks

- **Global Exception Filter**: The project correctly implements a global exception filter in `src/common/filters/http-exception.filter.ts`, which is registered in `main.ts`. This ensures consistent error handling across the application.

- **Authorization**: The use of the `@Roles()` decorator and `RolesGuard` provides a robust mechanism for endpoint authorization. This is demonstrated in controllers like `OrderController`, where administrative endpoints are protected.

- **Efficient Queries**: The repository pattern is used, which is the correct place to implement efficient queries. By using Objection.js features like `withGraphFetched` or `joinEager` within the repository methods, the application can avoid common performance pitfalls like the N+1 query problem.

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[![Node.js CI](https://github.com/okezieobi/order-processor/actions/workflows/node.js.yml/badge.svg)](https://github.com/okezieobi/order-processor/actions/workflows/node.js.yml)


[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project overview

This repository implements the Order Processor service used for managing brands, meals, addons, order types, calculated orders and orders. It uses NestJS, Objection.js with Knex and PostgreSQL. The test suite includes e2e tests that run against a local Postgres instance; CI runs the same e2e job via GitHub Actions.

## Quick start (dev)

These steps reproduce what CI runs locally.

1. Start services with docker-compose:

```bash
docker compose -f docker-compose.yml up -d --build
```

2. Wait for Postgres to become ready:

```bash
until pg_isready -h localhost -p 5432; do sleep 1; done
```

3. Install dependencies and run migrations:

```bash
npm ci
DB_HOST=localhost DB_USER=postgres DB_PASS=postgres DB_NAME=order_processor npm run migrate
```

4. Run e2e tests:

```bash
DB_HOST=localhost DB_USER=postgres DB_PASS=postgres DB_NAME=order_processor npm run test:e2e
```

Notes:
- On macOS, the filesystem may be case-insensitive — CI runs on Linux and is case-sensitive. If you see module-not-found errors in Actions but not locally, check filename casing (git ls-files) and use a two-step git mv to normalize case.


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
