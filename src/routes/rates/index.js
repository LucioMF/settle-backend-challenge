module.exports = {
    name: 'Rates',
    register: async (server, options) => {
      server.route([
        {
          method: 'GET',
          path: '/rates',
          handler: async (req, res) => {
            return 'This is rates API';
          }
        },
      ]);
    }
  };
