
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
  })

  ])
}
exports.down = (knex, Promise) => {
return knex.schema
  .dropTableIfExists('quizzes')
  .dropTableIfExists('users');

}