## Description

Basic backend application for Expenses tracker based on nestjs and prisma.

Authentization is based on jwt tokens.

Uses graphql and rest api. (We prefer rest api)

### Swagger
```
http://localhost:3333/api
```

### Graphql
```
http://localhost:3333/graphql
```

# Installation

### Install npm packages

```bash
$ npm install
```

### Env file

Copy or rename `.env_example` file to `.env` and update values with your own postgresql configuration.

### Initialize DB and seed data

Prerequisity is running postgresql. You can use
```bash
$ docker run --name postgres -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydbname -e POSTGRES_USER=myuser -p 5432:5432 -d postgres
```

Super user will be created as `seed@super.admin` with password `shared`. You can change it to whatever you want.

This command will create initialize db with shared data for all users

```bash
$ npx prisma migrate dev --name "init"
```

### Generate graphql file

```bash
$ npm run generate:gql
```

# Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
