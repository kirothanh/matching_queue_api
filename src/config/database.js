require("dotenv").config();
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: true, //log ra khi bị lỗi
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "postgres",
  },
};
