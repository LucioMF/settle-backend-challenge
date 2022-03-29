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
              return new Promise( async (rslv, rjct) => {
                await Rate.find((error, rates) => {
                  if (error) console.error(error);
                  rslv(rates);
                }).clone().catch(err => { console.error(error); });
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
                const baseUrl = 'http://data.fixer.io/api';
                const accessKey = '824e753b9d8f1bf170e5adf80e7788e9';
                const originalRate = parseInt(request.payload.originalRate);
                const base = request.payload.pair.toUpperCase().substring(0,3);
                const symbol = request.payload.pair.toUpperCase().substring(3,6);
                let responseRate;
                await axios.get(`${baseUrl}/latest?access_key=${accessKey}&base=${base}&symbols=${symbol}`)
                          .then((response) => {
                            responseRate = response.data.rates[symbol];
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                const feeAmount = request.payload.fee ? request.payload.fee / 100 * (originalRate*responseRate) : 0;
                const rate = new Rate({
                    pair: request.payload.pair.toUpperCase(),
                    originalRate: originalRate,
                    fee: request.payload.fee ? request.payload.fee : 0,
                    feeAmount,
                    rateWithFee: (originalRate*responseRate) + feeAmount,
                    apiResponseRate: responseRate,
                    createdAt: new Date(),
                });
                await rate.save((error, rate) => {
                  if (error) console.error(error);
                  rslv(rate.id);
                });
              });
          },
            description: 'Create Rate',
            notes: 'Create one rate',
            tags: ['Rates API'],
          }
        },
        {
          method: 'POST',
          path: '/rates',
          options: {
            handler: (request, reply) => {
              return new Promise( async (rslv, rjct) => {
                const ratesFound = await Rate.aggregate(
                  [
                    {$match: {pair: request.payload.pair.toUpperCase()}},
                    {$match:{ originalRate: request.payload.originalRate}},
                  ])
                  .sort({createdAt: 'desc'});
                const rate = ratesFound[0];
                if (!rate) { 
                  return rjct(new Error("Couldn't find Rate"));
                }
                const feeAmount = request.payload.fee / 100 * (rate.originalRate*rate.apiResponseRate);
                rate.fee = request.payload.fee;
                rate.feeAmount = feeAmount;
                rate.rateWithFee = (rate.originalRate*rate.apiResponseRate) + feeAmount;
                rate.updatedAt = new Date();
                await Rate.findByIdAndUpdate(rate._id, rate, {new: true}, (err, doc) => {
                  if (err) {
                    console.error(err);
                  }
                  rslv(doc);
                }).clone().catch(err => { console.error(err); });
              });
          },
            description: 'Add Fee',
            notes: 'Add a mark-up fee over one rate',
            tags: ['Rates API'],
          }
        },
      ]);
    }
  };
