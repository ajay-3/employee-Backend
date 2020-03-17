const express            = require('express');
const cors               = require('cors');

const bodyParser         = require('body-parser');
const Employee           = require('./Data/employee.js');
const upload             = require("./services/file-upload");

// const MongoClient = require("mongodb").MongoClient;
// const ObjectId = require("mongodb").ObjectID;

// const CONNECTION_URL = "mongodb+srv://<usr>:<psw>@employee-cfp3v.mongodb.net/test?retryWrites=true&w=majority";
// const DATABASE_NAME = "Employee";
 
 
  var app = express();
  
  app.set('port', process.env.PORT || 3000);
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  var database, collection;
  const singleUpload       = upload.single('image');
  let prsnt_id = 0;

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
        console.log(req.body)
        prsnt_id = prsnt_id + 1;
        const employee = new Employee({
          Id:prsnt_id,
          Name:req.body.Name,
          Salary:req.body.Salary,
          DOB:req.body.DOB,
          Skills:req.body.Skills,
          ImageUrl:req.body.imageUrl  
        });
        const employeeProfile = await employee.save();
        console.log(employeeProfile)
        return res.json(employeeProfile);
      }catch(err){
        console.log(err)
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
  const matchEmployees = await	Employee.find({Name : {$regex: pattern }});
  res.json(matchEmployees);
}catch(err){
  res.json({message:err})
}
}); 


app.post("/api/updateEmployee",async (req,res)=>{
    try{
      console.log(req.body)
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

app.post('/api/deleteEmployee', async (req, res)=>{
  try{
  const result=Employee.remove({Id:req.body.Id});
  res.json(result);
}catch(err){
    res.json({message:err})
  }
});
  

// var url = '';
// mongoose.connect(url,{useNewUrlParser:true});
// var db = mongoose.connection;
// db.on('connected',()=>{console.log("The connection has been established")})
// db.on('error', (err)=>{console.log("There has been an error which is" +err)});
// app.listen(app.get('port'),()=>{
//   MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
//       if(error) {
//           throw error;
//       }
//       database = client.db(DATABASE_NAME);
//       collection = database.collection("employee");
//       console.log("Connected to `" + DATABASE_NAME + "`!");
//   });});

app.listen(app.get('port'),()=>{})
