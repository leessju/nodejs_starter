const mongoose = require('mongoose');
const { Schema } = mongoose;

const carSchema = new Schema({
  car_id: String,
  car_name: String,
  createdAt: { type: Date, default: Date.now }
});

const car = mongoose.model('car', carSchema);

module.exports = car;
