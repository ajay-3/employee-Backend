const express            = require('express');
const cors               = require('cors');
var mongoose             = require('mongoose');
const bodyParser         = require('body-parser');
const Employee           = require('./Data/employee.js');
const Counter            = require('./Data/counter.js')
const upload             = require("./services/file-upload");

 
  var app = express();
  
  app.set('port', process.env.PORT || 3000);
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  const singleUpload       = upload.single('image');

app.post("/api/imageUpload", async (req, res)=> {
    singleUpload(req, res, (err)=> {
      if (err) {
        return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
      }
      return res.send({'imageUrl': req.file.location});  
    });
  });

app.post("/api/addEmployee",async (req,res)=>{
      try{
        var check = await Counter.find();
       if(check.length!=0){
         console.log("enter")
        var brek= await Counter.update({Id:"uniqueKey"},{$inc: {count:1}});
         console.log(brek) 
      }else{
        const counter = new Counter({Id:"uniqueKey",count:1});
        await counter.save()
       }
       var result = await Counter.find();
       const employee = new Employee({
        Id:result[0].count,
        Name:req.body.Name,
        Salary:req.body.Salary,
        DOB:req.body.DOB,
        Skills:req.body.Skills,
        ImageUrl:req.body.imageUrl
      });
      const employeeProfile = await employee.save();
      return res.json(employeeProfile);
      }catch(err){
        res.json({message:err})
      }
})

app.get("/api/getEmployees",async (req,res)=>{
    try{
      const employee = await Employee.find();
      res.json(employee);
      }catch(err){
        res.json({message:err})
      }   
});

app.post('/api/searchemployees', async (req, res)=>{
  try{
    var pattern = req.body.searchValue;
  const matchEmployees = await	Employee.find({Name : {$regex: pattern}});
  res.json(matchEmployees);
}catch(err){
  res.json({message:err})
}
}); 


app.put("/api/updateEmployee",async (req,res)=>{
    try{
      var query = {
        Name:req.body.Name,
        Salary:req.body.Salary,
        DOB:req.body.DOB,
        Skills:req.body.Skills,
        ImageUrl:req.body.ImageUrl       
      };
      var result =await Employee.update({Id:req.body.Id}, {$set:query});
      res.json(result);
        }catch(err){
      res.json({message:err});
    }
});

app.delete('/api/deleteEmployee/:Id', async (req, res)=>{
  try{
    console.log(req.params.Id)
  const result= await Employee.remove({Id:req.params.Id});
  res.status(200).json(result);
}catch(err){
    res.json({message:err})
  }
});
  

var url = 'mongodb://127.0.0.1:27017/Employee';
mongoose.connect(url,{useNewUrlParser:true});
var db = mongoose.connection;
db.on('connected',()=>{console.log("The connection has been established")})
db.on('error', (err)=>{console.log("There has been an error which is" +err)});

app.listen(app.get('port'),()=>{console.log("Server started at "+app.get("port"))})
