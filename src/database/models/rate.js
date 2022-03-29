const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var RateSchema = new Schema({
    pair: String,
    originalRate: Number,
    fee: Number,
    feeAmount: Number,
    rateWithFee: Number,
    apiResponseRate: Number,
    createdAt: {
        type: Date,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
});
module.exports = mongoose.model('Rate', RateSchema);