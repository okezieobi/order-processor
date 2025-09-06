import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary();
    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('email').notNullable().unique();
    t.string('phone').nullable();
    t.string('password_hash').notNullable();
    t.boolean('is_active').defaultTo(true);
    t.jsonb('roles').defaultTo('[]');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('brands', (t) => {
    t.uuid('id').primary();
    t.string('name').notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('order_types', (t) => {
    t.uuid('id').primary();
    t.string('name').notNullable(); // e.g., CARD, CASH
    t.timestamps(true, true);
  });

  await knex.schema.createTable('meals', (t) => {
    t.uuid('id').primary();
    t.string('name').notNullable();
    t.boolean('active').defaultTo(true);
    t.uuid('brand_id').references('brands.id').onDelete('SET NULL');
    t.integer('amount').defaultTo(0); // store in kobo
    t.timestamps(true, true);
  });

  await knex.schema.createTable('addons', (t) => {
    t.uuid('id').primary();
    t.string('name').notNullable();
    t.integer('amount').notNullable(); // kobo
    t.uuid('brand_id').references('brands.id').onDelete('SET NULL');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('calculated_orders', (t) => {
    t.uuid('id').primary();
    t.integer('total_amount').notNullable().defaultTo(0);
    t.boolean('free_delivery').defaultTo(false);
    t.integer('delivery_fee').defaultTo(0);
    t.integer('service_charge').defaultTo(0);
    t.jsonb('address_details').defaultTo('{}');
    t.decimal('lat', 12, 9).nullable();
    t.decimal('lng', 12, 9).nullable();
    t.boolean('pickup').defaultTo(false);
    t.timestamps(true, true);
  });

  // Pivot: calculated_order_meals
  await knex.schema.createTable('calculated_order_meals', (t) => {
    t.uuid('id').primary();
    t.uuid('calculated_order_id')
      .notNullable()
      .references('calculated_orders.id')
      .onDelete('CASCADE');
    t.uuid('meal_id').notNullable().references('meals.id').onDelete('RESTRICT');
    t.integer('quantity').notNullable().defaultTo(1);
    t.integer('amount').notNullable().defaultTo(0); // snapshot price per item
    t.timestamps(true, true);
  });

  // Pivot: calculated_order_meal_addons
  await knex.schema.createTable('calculated_order_meal_addons', (t) => {
    t.uuid('id').primary();
    t.uuid('calculated_order_meal_id')
      .notNullable()
      .references('calculated_order_meals.id')
      .onDelete('CASCADE');
    t.uuid('addon_id')
      .notNullable()
      .references('addons.id')
      .onDelete('RESTRICT');
    t.integer('quantity').notNullable().defaultTo(1);
    t.integer('amount').notNullable().defaultTo(0); // snapshot price per addon
    t.timestamps(true, true);
  });

  await knex.schema.createTable('orders', (t) => {
    t.uuid('id').primary();
    t.uuid('user_id').notNullable();
    t.boolean('completed').defaultTo(false);
    t.boolean('cancelled').defaultTo(false);
    t.boolean('kitchen_cancelled').defaultTo(false);
    t.boolean('kitchen_accepted').defaultTo(false);
    t.boolean('kitchen_prepared').defaultTo(false);
    t.boolean('kitchen_dispatched').defaultTo(false);
    t.boolean('rider_assigned').defaultTo(false);
    t.boolean('paid').defaultTo(false);
    t.string('order_code').unique();
    t.uuid('calculated_order_id')
      .references('calculated_orders.id')
      .onDelete('SET NULL');
    t.uuid('order_type_id').references('order_types.id').onDelete('SET NULL');
    t.timestamp('kitchen_dispatched_time').nullable();
    t.timestamp('kitchen_completed_time').nullable();
    t.timestamp('kitchen_verified_time').nullable();
    t.timestamp('completed_time').nullable();
    t.boolean('scheduled').defaultTo(false);
    t.boolean('is_hidden').defaultTo(false);
    t.jsonb('order_total_amount_history').defaultTo('[]');
    t.jsonb('failed_trip_details').defaultTo('{}');
    t.string('box_number').nullable();
    t.timestamps(true, true);
    t.index(['order_code']);
    t.index(['user_id', 'created_at']);
  });

  await knex.schema.createTable('order_logs', (t) => {
    t.uuid('id').primary();
    t.uuid('order_id')
      .notNullable()
      .references('orders.id')
      .onDelete('CASCADE');
    t.timestamp('time').notNullable().defaultTo(knex.fn.now());
    t.string('description').notNullable();
    t.timestamps(true, true);
    t.index(['order_id', 'time']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('order_logs')
    .dropTableIfExists('orders')
    .dropTableIfExists('calculated_order_meal_addons')
    .dropTableIfExists('calculated_order_meals')
    .dropTableIfExists('calculated_orders')
    .dropTableIfExists('addons')
    .dropTableIfExists('meals')
    .dropTableIfExists('order_types')
    .dropTableIfExists('brands')
    .dropTableIfExists('users');
}
