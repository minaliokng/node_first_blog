require("dotenv").config();

const DBAddress = process.env.DBAddress;
const DBHost = process.env.DBHost;
const DBPw = process.env.DBPw;

module.exports = {
  "development": {
    "username": DBHost,
    "password": DBPw,
    "database": "database_development",
    "host": DBAddress,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
