const env = process.env;

const development = {
    "username": "jangwoopark",
    "password": "pc112400pjw3",
    "database": "hopcalendar2.0",
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
