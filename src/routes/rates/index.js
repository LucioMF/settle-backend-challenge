const Rate = require('../../database/models/rate');
const axios = require('axios');
const Joi = require('joi');

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
            tags: ['api'],
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
                let apiResponse;
                let feeAmount;
                let responseRate;
                let rateWithFee;

                await axios.get(`${baseUrl}/latest?access_key=${accessKey}&base=${base}&symbols=${symbol}`)
                  .then((response) => {
                    apiResponse = response.data;
                  })
                  .catch((error) => {
                    console.error(error);
                  });

                if(!apiResponse.success) {
                  await axios.get(`${baseUrl}/latest?access_key=${accessKey}&base=EUR&symbols=${base},${symbol}`)
                  .then((response) => {
                    const EUR_to_base = response.data.rates[base];
                    const EUR_to_symbol = response.data.rates[symbol];
                    const BASE_to_EUR = 1/EUR_to_base;
                    responseRate = ((originalRate*BASE_to_EUR)*EUR_to_symbol) / originalRate;
                    feeAmount = request.payload.fee ? request.payload.fee / 100 * ((originalRate*BASE_to_EUR)*EUR_to_symbol) : 0;
                    rateWithFee = ((originalRate*BASE_to_EUR)*EUR_to_symbol) + feeAmount;
                  })
                  .catch((error) => {
                    console.error(error);
                  });
                } else {
                  responseRate = apiResponse.rates[symbol];
                  feeAmount = request.payload.fee ? request.payload.fee / 100 * (originalRate*responseRate) : 0;
                  rateWithFee = (originalRate*responseRate) + feeAmount;
                }

                const rate = new Rate({
                    pair: request.payload.pair.toUpperCase(),
                    originalRate: originalRate,
                    fee: request.payload.fee ? request.payload.fee : 0,
                    feeAmount,
                    rateWithFee,
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
            tags: ['api'],
            validate: {
              payload: Joi.object({
                pair: Joi.string().required(),
                originalRate: Joi.number().required(),
                fee: Joi.number(),
              })
            },
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
            tags: ['api'],
            validate: {
              payload: Joi.object({
                pair: Joi.string().required(),
                originalRate: Joi.number().required(),
                fee: Joi.number().required(),
              })
            },
          }
        },
      ]);
    }
  };
