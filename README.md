# Boilerplate

This is a boilerplate for my favorite stack at the moment. Technologies include Node, Express, Graphql/Apollo, Sequelize, Knex (for migrations and seed data), Cloudinary (for image hosting/editing), sendgrid (for transactional emails), Mapbox (Maps library), Material-UI (component library), passport (for local authentication), and webpack/babel for compiling. This boilerplate gives you the basic framework for a web-app with user login, transactional emails, protected urls, and a graphql api for your database.

## Getting Started

### Create your local database:

`createdb [database name] -U [username] --password -p 5432`

### Create pg session table to store sessions

`CREATE TABLE "session" ( "sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL ) WITH (OIDS=FALSE); ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`

### Set your environmental variables:

HOST : server host
PORT : server port
PGDATABASE : database host
DATABASE_URL : postgres database url
PGPORT : database port
PGUSER : database user
PGPASSWORD : database password
MapboxAccessToken : Mapbox API token
SENDGRID_API_KEY : sendgrid API key
ACCOUNT_INFO_EMAIL : sender for transactional emails
ACCOUNT_INFO_NAME : sender for transactional emails (display name)
CLOUDINARY_CLOUD_NAME : cloudinary name
CLOUDINARY_API_KEY : cloudinary api key
CLOUDINARY_API_SECRET : cloudinary api secret

### Add favicon

### Install dependancies

`yarn install`

### Sync Database on first run

`yarn-dev-sync`

### Run server / app

`yarn dev`

## Deploying

###c reate heroku app

### whitelist cors urls in schema.js
