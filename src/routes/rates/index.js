const Rate = require('../../database/models/rate');
const axios = require('axios');

module.exports = {
    name: 'Rates',
    register: async (server, options) => {
      server.route([
        {
          method: 'GET',
          path: '/rates',
          options: {
            handler: async (req, res) => {
              Rate.find(function(error, rates) {
                if (error) {
                    console.error(error);
                }
                reply(rates);
              });
            },
            description: 'Get rates',
            notes: 'Return all rates',
            tags: ['Rates API'],
          }
        },
        {
          method: 'PUT',
          path: '/rates',
          options: {
            handler: (request, reply) => {
              return new Promise( async (rslv, rjct) => {
                baseUrl = 'https://data.fixer.io/api';
                accessKey = '824e753b9d8f1bf170e5adf80e7788e9';
                await axios.get(`${baseUrl}/convert` +
                            `?access_key=${accessKey}` +
                            `&from=${request.payload.pair.substring(0,2)}` +
                            `&to=${request.payload.pair.substring(3,5)}` +
                            `&amount=${request.payload.originalRate}`)
                          .then((response) => {
                            return rslv(response);
                          })
                          .catch((error) => {
                            return rjct(error);
                          });
                // const rate = new Rate({
                //     pair: request.payload.pair,
                //     originalRate: request.payload.originalRate,
                //     fee: request.payload.fee,
                //     feeAmount: request.payload.feeAmount,
                //     rateWithFee: request.payload.rateWithFee,
                // });
                // await rate.save(function(error, rate) {
                //   if (error) rjct(error);
                //   rslv(rate.id);
                // });
              });
          },
            description: 'Get rates',
            notes: 'Return all rates',
            tags: ['Rates API'],
          }
        },
      ]);
    }
  };
