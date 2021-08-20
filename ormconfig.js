  module.exports = {
    "type": process.env.DATABASE_CONNECTION,
    "host": process.env.DATABASE_HOST,
    "port": parseInt(process.env.DATABASE_PORT),
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "autoLoadEntities": true,
    "synchronize": true,
    "logging": false,
    "entities": ["dist/**/*.entity.js"],
    "migrations": ["dist/migrations/**/*.js"],
    "subscribers": ["dist/subscribers/**/*.js"],
    "cli": {
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscribers"
    }
  };
  