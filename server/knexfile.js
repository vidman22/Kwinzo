    //"postgres://localhost/kwinzo",
module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/kwinzo",
    pool: {
      min: 2,
      max: 10
    },
    // migrations: {
    //   tableName: "knex_migrations"
    // },
    debug: true
  },

  staging: {
    client: "pg",
    connection: "postgres://postgres@localhost/kwinzo",
    pool: {
      min: 2,
      max: 10
    },
    // migrations: {
    //   tableName: "knex_migrations"
    // }
    debug: true
  },

  production: {
    client: "pg",
    connection: "postgres://postgres@localhost/kwinzo",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    debug: true
  }
};
