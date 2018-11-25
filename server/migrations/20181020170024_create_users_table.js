
exports.up = (knex, Promise) => {
return Promise.all([knex.schema.createTable('users', table => {
      table.increments();
      table.string('username');
      table.string('email');
      table.string('password');
      table.string('picture');
      table.string('uuid');
      table.timestamp('created_at', knex.fn.now());
      table.timestamp('updated_at', knex.fn.now());
   }),
   knex.schema.createTable('quizzes', table => {
    table.increments('id');
    table.string('title');
    table.specificType('sentences', 'json[]');
    table.string('uniqid');
    table.timestamp('created_at', knex.fn.now());
    table.timestamp('updated_at', knex.fn.now());
    table.integer('authorID').unsigned()
    table.foreign('authorID').references('id').inTable('users').onDelete('cascade');
  }),
  knex.schema.createTable('omission-reading', table => {
    table.increments('id');
    table.string('title');
    table.text('text', 'longtext');
    table.specificType('omissions', 'json[]');
    table.string('uniqid');
    table.timestamp('created_at', knex.fn.now());
    table.timestamp('updated_at', knex.fn.now());
    table.integer('authorID').unsigned()
    table.foreign('authorID').references('id').inTable('users').onDelete('cascade');
  }),
  knex.schema.createTable('comprehension-reading', table => {
    table.increments('id');
    table.string('title');
    table.text('text', 'longtext');
    table.specificType('questions', 'json[]');
    table.string('uniqid');
    table.timestamp('created_at', knex.fn.now());
    table.timestamp('updated_at', knex.fn.now());
    table.integer('authorID').unsigned();
    table.foreign('authorID').references('id').inTable('users').onDelete('cascade');
  }),
  knex.schema.createTable('classes', table => {
    table.increments('id');
    table.string('classname');
    table.string('uniqid');
    table.timestamp('created_at', knex.fn.now());
    table.timestamp('updated_at', knex.fn.now());
  }),
  knex.schema.createTable('class-om-reading-junction', table => {
    table.integer('classID').notNullable().unsigned();
    table.integer('omID').notNullable().unsigned();
    table.foreign('classID').references('id').inTable('classes').onDelete('cascade');
    table.foreign('omID').references('id').inTable('omission-reading').onDelete('cascade');
  }),
  knex.schema.createTable('class-comp-reading-junction', table => {
    table.integer('classID').notNullable().unsigned();
    table.integer('compID').notNullable().unsigned();
    table.foreign('classID').references('id').inTable('classes').onDelete('cascade');
    table.foreign('compID').references('id').inTable('comprehension-reading').onDelete('cascade');
  }),
  knex.schema.createTable('class-quizzes-junction', table => {
    table.integer('classID').notNullable().unsigned();
    table.integer('quizID').notNullable().unsigned();
    table.foreign('classID').references('id').inTable('classes').onDelete('cascade');
    table.foreign('quizID').references('id').inTable('quizzes').onDelete('cascade');
  }),
  knex.schema.createTable('user-om-reading-junction', table => {
    table.integer('userID').notNullable().unsigned();
    table.integer('omID').notNullable().unsigned();
    table.foreign('userID').references('id').inTable('users').onDelete('cascade');
    table.foreign('omID').references('id').inTable('omission-reading').onDelete('cascade');
  }),
  knex.schema.createTable('user-comp-reading-junction', table => {
    table.integer('userID').notNullable().unsigned();
    table.integer('compID').notNullable().unsigned();
    table.foreign('userID').references('id').inTable('users').onDelete('cascade');
    table.foreign('compID').references('id').inTable('comprehension-reading').onDelete('cascade');
  }),
  knex.schema.createTable('user-quizzes-junction', table => {
    table.integer('userID').notNullable().unsigned();
    table.integer('quizID').notNullable().unsigned();
    table.foreign('userID').references('id').inTable('users').onDelete('cascade');
    table.foreign('quizID').references('id').inTable('quizzes').onDelete('cascade');
  }),
  knex.schema.createTable('users-classes-junction', table => {
    table.integer('userID').notNullable().unsigned();
    table.integer('classID').notNullable().unsigned();
    table.foreign('userID').references('id').inTable('users').onDelete('cascade');
    table.foreign('classID').references('id').inTable('classes').onDelete('cascade');
  }),
  knex.schema.createTable('students', table => {
    table.increments('id');
    table.timestamp('created_at', knex.fn.now());
    table.timestamp('updated_at', knex.fn.now());
    table.integer('userID').unsigned();
    table.foreign('userID').references('id').inTable('users').onDelete('cascade');
  }),
  knex.schema.createTable('teachers', table => {
    table.increments('id');
    table.timestamp('created_at', knex.fn.now());
    table.timestamp('updated_at', knex.fn.now());
    table.boolean('member');
    table.integer('userID').unsigned();
    table.foreign('userID').references('id').inTable('users').onDelete('cascade');
  })
    
  ])
}
exports.down = (knex, Promise) => {
return knex.schema
  .dropTableIfExists('quizzes')
  .dropTableIfExists('users')
  .dropTableIfExists('omission-reading')
  .dropTableIfExists('comprehension-reading')
  .dropTableIfExists('classes')
  .dropTableIfExists('class-om-reading-junction')
  .dropTableIfExists('class-comp-reading-junction')
  .dropTableIfExists('class-quizzes-junction')
  .dropTableIfExists('user-om-reading-junction')
  .dropTableIfExists('user-comp-reading-junction')
  .dropTableIfExists('user-quizzes-junction')
  .dropTableIfExists('users-classes-junction')
  .dropTableIfExists('students')
  .dropTableIfExists('teachers');

}