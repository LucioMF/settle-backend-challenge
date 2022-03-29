[![Hapi.JS](https://img.shields.io/npm/v/hapi.svg?label=hapi&style=flat-square)](https://hapijs.com)
[![Mongoose](https://img.shields.io/npm/v/mongoose.svg?label=mongoose&style=flat-square)](http://mongoosejs.com/)

> ### Hapi.JS Server for Rates API (Hapi.JS + Mongoose) [Settle Challenge](https://github.com/LucioMF/settle-backend-challenge).

# Getting started

## Install Node

Install [Node.JS LTS version](https://nodejs.org/en/download/) 

## To get the Node server running locally

- Clone this repo
- `cd /path/where/your/cloned/the/repo`
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod -d /path/where/you/want/to/store/the/data`
- `npm run start` to start the local server
- The Rates API is available at `http://localhost:8080/rates`

## To get the Node server running locally with Docker

- Install [Docker](https://docs.docker.com/engine/installation/)
- Clone this repo
- `cd /path/where/your/cloned/the/repo`
- Run `docker-compose up --force-recreate --build -d`
- The Rates API is available at `http://localhost:8080/rates`

# Code Overview

## Dependencies

- [hapijs](https://github.com/hapijs/hapi) - The server for handling and routing HTTP requests
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 

## Application Structure

- `src/index.js` - The entry point to our application. This file bootstrap our HapiJS server. It also requires the routes and models we'll be using in the application.
- `src/database/` - This folder contains models and DB configuration using Mongoose.
- `src/routes/` - This folder contains the routes definitions for our API.

# Documentation

I use [hapi-swagger](https://github.com/glennjones/hapi-swagger) for the API endpoints documentation. Documentation available at `http://localhost:8080/documentation`.