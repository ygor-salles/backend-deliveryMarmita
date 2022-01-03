# NestJSApiBoilerplateJWT

API in NestJS. Backend application for registration of lunchboxes and beverages, inclusion of freight and additions to lunchboxes, viewing and filtering orders and order history, dashboard queries.

## Installation

```bash
   $ yarn
```

## Set Enviroment for secret key JWT

```bash
   $ cp .env.example .env
```

## Config settings .env for send notification when a user registers, forgot password or change password

```
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_AUTH_USER=[:user]
   EMAIL_AUTH_PASSWORD=[:password]
```

## Config settings ormconfig.json for connect MySQL
Once the database has been configured, start the Nest App via ```yarn start:dev``` it automatically synchronizes the entities so ready to use. :heart_eyes_cat:

```
{
   "type": "mysql",
   "host": "localhost",
   "port": 3306,
   "username": "my_username",
   "password": "my_password",
   "database": "my_database",
   "synchronize": true,
   "logging": false,
   "entities": [
      "dist/**/*.entity.js"
   ],
   "migrations": [
      "dist/migration/**/*.js"
   ],
   "subscribers": [
      "dist/subscriber/**/*.js"
   ],
   "cli": {
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
```

## Running the app

```bash
    # development
    $ yarn start

    # watch mode
    $ yarn start:dev

    # production mode
    $ yarn start:prod
```

## Docker

There is a `docker-compose.yml` file for starting MySQL with Docker.

`$ docker-compose up`

After running, you can stop the Docker container with

`$ docker-compose down`

## Generate the build

```bash
yarn build
```

## Application modeling

<img src="https://raw.githubusercontent.com/ygor-salles/backend-deliveryMarmita/main/assets/modeloBD.PNG"
  alt="ModelagemBanco">
  
 ## Collection requests - insomnia
 
 - The collections of the `Collection-Insomnia.json` backend requests are found inside the `assets` folder of this project.
