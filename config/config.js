const env = process.env;

const development = {
    "username": env.POSTGRES_USERNAME,
    "password": env.POSTGRES_PASSWORD,
    "database": env.POSTGRES_DATABASE,
    "host": "localhost",
    "dialect": "postgres"
}

const test = {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }

const production = {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
