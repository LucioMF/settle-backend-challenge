var rates = require('./rates');

var base = module.exports = {
  name: 'ApiRoutes',
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/',
        handler: async (req, res) => {
          return '<h1>Welcome to my HapiJs API, I\'m Lucio. Cheers!!</h1>';
        }
      },
    ]);
  }
}

module.exports = [].concat(base, rates);
