const Hapi = require('@hapi/hapi');
const routes = require("./routes");
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

require('dotenv').config();

require('./database/database');

const server = Hapi.server({
  port: process.env.PORT,
  host: process.env.HOST,
  app: {}
});

const swaggerOptions = {
  info: {
          title: 'Challenge API Documentation',
          version: '1.0.0',
      },
  };

const startServer = async () => {
  try {
    await server.register(routes);
    await server.register([
      Inert.plugin,
      Vision.plugin,
      {
          plugin: HapiSwagger,
          options: swaggerOptions
      }
    ]);
    await server.start();
    console.log(`Server running on: ${server.info.uri}`);
  } catch (error) {
    console.log(`Error trying to run HapiJs server: ${error}`);
  }
};

startServer();
