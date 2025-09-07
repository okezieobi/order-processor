# Order Processor

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[![Node.js CI](https://github.com/okezieobi/order-processor/actions/workflows/node.js.yml/badge.svg)](https://github.com/okezieobi/order-processor/actions/workflows/node.js.yml)

This repository contains the implementation of the Order Processor service, a backend system for managing kitchen orders. It is built with [NestJS](https://github.com/nestjs/nest), a progressive [Node.js](http://nodejs.org) framework for building efficient and scalable server-side applications. It uses [Objection.js](https://vincit.github.io/objection.js/) as an ORM and [Knex.js](https://knexjs.org/) for SQL query building, all on a PostgreSQL database.

## Project Implementation (Task 1)

This section details how the project addresses the requirements of Task 1.

### 1. Setup

- **Framework**: The project is initialized as a standard [NestJS](https://nestjs.com/) application.
- **Database**: It is configured to use **PostgreSQL**.
- **ORM and Query Builder**: [Objection.js](https://vincit.github.io/objection.js/) and [Knex.js](https://knexjs.org/) are integrated for database operations. The configuration can be found in `knexfile.ts` and `src/infrastructure/database/database.module.ts`.

### 2. Data Modeling with Objection.js

Objection.js models for all required entities are located in `src/infrastructure/objection/models`. Each model extends a `BaseModel` to ensure consistency and includes properties and relationships as required.

- `Order` -> `order.model.ts`
- `OrderLog` -> `order-log.model.ts`
- `CalculatedOrder` -> `calculated-order.model.ts`
- `Meal` -> `meal.model.ts`
- `Addon` -> `addon.model.ts`
- `Brand` -> `brand.model.ts`
- `OrderType` -> `order-type.model.ts`

### 3. CRUD Operations

The project follows a layered architecture to provide clear separation of concerns:

- **Controllers**: Located in `src/interfaces/http/controllers`, these handle incoming HTTP requests.
- **Services**: Located in `src/application/services`, these contain the core business logic.
- **Repositories**: Located in `src/infrastructure/objection/repositories`, these abstract the database interactions.

Each entity has a dedicated module with a controller, service, and repository, exposing the following standard RESTful endpoints:

- `POST /<entity>`: Create a new record.
- `GET /<entity>/:id`: Retrieve a record by its ID.
- `PUT /<entity>/:id`: Update a record by its ID.
- `DELETE /<entity>/:id`: Delete a record by its ID.
- `GET /<entity>`: Retrieve a list of all records with pagination.

### 4. DTOs and Validations

- **Data Transfer Objects (DTOs)** for create and update operations are defined in `src/interfaces/http/dto`.
- **Validation**: For most DTOs, `class-validator` decorators are used for validation. For the complex `Order` model, a `JoiValidationPipe` is implemented with a schema defined in `src/interfaces/http/dto/orders/joi-schema.ts`.

### 5. Middleware and Utilities

A `RequestLoggerMiddleware` is implemented at `src/common/middleware/request-logger.middleware.ts`. It is applied globally in `app.module.ts` to log the `method`, `endpoint`, `request body`, and `timestamp` of every incoming request.

### 6. Business Logic

The `OrderService` (`src/application/services/order.service.ts`) contains the `processOrder` method, which:

- Validates the order status.
- Simulates kitchen processes (e.g., `kitchen_accepted`, `kitchen_prepared`).
- Calculates the total order amount, including addons.
- Logs the order status changes to the `OrderLog` entity.

## System Architecture Design (Task 2)

This section outlines a high-level architecture for a large-scale, global order processing system.

### Architectural Goals

- **Scalability**: Handle millions of orders daily.
- **Resilience**: Tolerate failures and maintain high availability.
- **Maintainability**: Allow for independent development and deployment of components.

### High-Level Architecture

A microservices architecture is proposed to meet these goals:

- **API Gateway**: A single entry point for all clients, handling routing, authentication, and rate limiting.
- **Load Balancers**: Distribute traffic across microservice instances.
- **Microservices**:
  - **Order Service**: Manages the order lifecycle.
  - **Kitchen Service**: Handles kitchen-specific logic.
  - **User Service**: Manages user accounts and authentication.
  - **Payment Service**: Integrates with payment providers.
- **Message Broker (e.g., RabbitMQ, Kafka)**: For asynchronous communication between services, decoupling them and improving fault tolerance.
- **Distributed Cache (e.g., Redis)**: Caches frequently accessed data to reduce latency.

### Data Storage

Each microservice owns its data. A sharded PostgreSQL database (sharded by `region` or `brand_id`) would be used for the Order and Kitchen services to allow for horizontal scaling. Read replicas would handle high read volumes.

### Real-time Updates and Data Consistency

WebSockets would provide real-time updates to clients. The **Saga pattern** would be used for distributed transactions to ensure data consistency across services.

### Resilience and Security

- **Resilience**: Multiple instances of each service and database would run to ensure high availability. Health checks and circuit breakers would be used to detect and isolate failures.
- **Security**: **JWT** for authentication (`jwt.strategy.ts`) and **Role-Based Access Control (RBAC)** for authorization (`roles.guard.ts`) are implemented. All sensitive data would be encrypted in transit and at rest.

## Bonus Tasks

- **Global Exception Filter**: A global exception filter is implemented in `src/common/filters/http-exception.filter.ts` and registered in `main.ts` to ensure consistent error handling.
- **Authorization**: The `@Roles()` decorator and `RolesGuard` provide a mechanism for endpoint authorization, as seen in the `OrderController`.
- **Efficient Queries**: The repository pattern is used, which is the correct place to implement efficient queries using Objection.js features like `withGraphFetched` or `joinEager` to prevent issues like the N+1 query problem.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/products/docker-desktop)

### Installation and Running the Application

1.  **Start services with docker-compose:**

    ```bash
    docker compose -f docker-compose.yml up -d --build
    ```

2.  **Wait for Postgres to become ready:**

    ```bash
    until pg_isready -h localhost -p 5432; do sleep 1; done
    ```

3.  **Install dependencies and run migrations:**

    ```bash
    npm ci
    DB_HOST=localhost DB_USER=postgres DB_PASS=postgres DB_NAME=order_processor npm run migrate
    ```

4.  **Run the application:**

    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com) - The official documentation.
- [Discord channel](https://discord.gg/G7Qnnhy) - For questions and support.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).