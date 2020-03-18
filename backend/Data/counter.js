var mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
  Id:{
    type:String,
    unique:true
  },
  count:{
      type:Number,
      unique:true
  }
});
module.exports  = mongoose.model('Counter', counterSchema);