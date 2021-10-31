
if (process.env.NODE_ENV === 'development') {
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
} else if (process.env.NODE_ENV === 'production') {
  module.exports = {
    "type": process.env.DATABASE_CONNECTION_PROD,
    "host": process.env.DATABASE_HOST_PROD,
    "port": parseInt(process.env.DATABASE_PORT_PROD),
    "username": process.env.DATABASE_USER_PROD,
    "password": process.env.DATABASE_PASSWORD_PROD,
    "database": process.env.DATABASE_NAME_PROD,
    "autoLoadEntities": true,
    "synchronize": true,
    "extra": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false,
      },
    },
    "logging": false,
    "entities": ["dist/**/*.entity.js"],
    "migrations": ["dist/migrations/**/*.js"],
    "subscribers": ["dist/subscribers/**/*.js"],
    "cli": {
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscribers"
    }
  };
}
