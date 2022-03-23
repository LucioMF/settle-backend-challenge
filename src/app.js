const Hapi = require('@Hapi/hapi');
const routes = require("./routes");

require('./database');

const server = Hapi.server({
  port: 8080,
  host: 'localhost',
  app: {}
});

const startServer = async () => {
  try {
    await server.register(routes);
    await server.start();
    console.log(`Server running on: ${server.info.uri}`);
  } catch (error) {
    console.log(`Error trying to run HapiJs server: ${error}`);
  }
};

startServer();
