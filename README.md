
## Description

This is a simple project to demonstrate how to use the NestJS framework to create a simple banking backend. The project use postgres to store data, with atomic transaction support. The project also use the TypeORM to manage the database.

### Technologies used
- NestJS
- Postgres
- TypeORM
- Docker


## Installation

```bash
$ pnpm install
```

## Running the app

```bash
$ APP_PORT=3000 docker-compose up -d
// app run at http://localhost:3000
// you can change the APP_PORT to any port you want
```

## Test

```bash
# unit tests
$ pnpm run test
```


