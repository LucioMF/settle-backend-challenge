const Hapi = require('@Hapi/hapi');
const routes = require("./routes");
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

require('./database/database');

const server = Hapi.server({
  port: 8080,
  host: 'localhost',
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
