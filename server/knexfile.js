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
    connection: {
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      user: process.env.DBUSER,
      password: process.env.PGPASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    // migrations: {
    //   tableName: "knex_migrations"
    // }
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      user: process.env.DBUSER,
      password: process.env.PGPASSWORD,
      ssl: true
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};