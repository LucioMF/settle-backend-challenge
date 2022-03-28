const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var RateSchema = new Schema({
    pair: String,
    originalRate: Number,
    fee: Number,
    feeAmount: Number,
    rateWithFee: Number,
});
module.exports = mongoose.model('Rate', RateSchema);