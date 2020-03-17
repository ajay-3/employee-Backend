var mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  Id:{
    type:Number,
    unique:true
  },
  Name: {
    type: String,
    unique: false,
  },
  Salary: {
    type: String,
    unique: false,
  },
  DOB: {
    type: String,
    unique: false,
  },
  Skills:{
     type:Array,
     unique:false
  },
  imageUrl:{
      type:String,
      unique:false
  }
});
module.exports  = mongoose.model('employee', employeeSchema);
