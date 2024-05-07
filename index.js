const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json())

app.get('/inc', async (req, res) => {
  let result = await client.db("foodsample").collection("fooddetail").updateOne(
    {name: {$eq:"Nasi Lemak"} },
    {
      $inc: {price: 3}
    },
    res.send(result)
  )
})

//new user registration
app.post('/user', async (req, res) => {
  //check if username already exist
  let existing = await client.db("testrun").collection("test123").findOne({
    username: req.body.username
  })
  if(existing){
    res.status(400).send("username already exist")
  }
  else{
  //insertOne the registration data to mongo
  const hash = bcrypt.hashSync(req.body.password, 10); //hash pwd, 10 rounds
  //console.log(req.body.username)
  let result = await client.db("testrun").collection("test123").insertOne(
  {
    username: req.body.username,
    password: hash, //instead of password: req.body.password, -- bcs want to hash pwd
    name: req.body.name,
    email: req.body.email
  }
)
res.send(result)
}
})

//user login api
app.post('/login', async (req, res) => {
  if (req.body.username != null && req.body.password != null) {
  // step #1: res.body.username? -need to check if username is in database-find
  let result = await client.db("testrun").collection("test123").findOne({
      //req.body.username is username submitted by user, 'username' is the document in data
      username: req.body.username 
  })

  if (result) {
    // step #2: if user exist, check if password is correct
    if (bcrypt.compareSync(req.body.password, result.password) == true) {
      // password is correct
      var token = jwt.sign(
        { _id: result._id, username: result.username, name: result.name}, 
        'thisisthepasskey',
        {expiresIn: 120}
      );
      res.send(token)
    } else {
      // password is incorrect
      res.status(401).send('wrong password')
    }

  } else {
    // step #3: if user not found
    res.status(401).send("username is not found")
  }
  } else {
    req.status(400).send("missing username or password")
  }
})
  
// get user profile
app.get('/user/:id', verifyToken, async (req, res) => {
  let auth = req.headers.authorization
  let authSplitted = auth.split(' ')
  let token = authSplitted[1]
  let decoded = jwt.verify(token, 'thisisthepasskey')
  console.log(decoded)
   //console.log(req.headers.authorization.split(' '))

  if (decoded._id != req.params.id) {
    res.status(401).send('Unauthorized Access')
  }else {
    let result = await client.db("testrun").collection("test123").findOne({
      _id: new ObjectId(req.params.id)
    })
    res.send(result)
  }
})

// update user account
app.patch('/user/:id', verifyToken, async (req, res) => {
  if (req.identify._id != req.params.id) {
    res.send('Unauthorized')
  }else {
    let result = await client.db("testrun").collection("test123").updateOne(
      {
        _id: new ObjectId(req.params.id)
      },
      {
        $set: {
          name: req.body.name
        }
      }
    )
    res.send(result)
  }
})

// delete user account
app.delete('/user', (req, res) => {
  // deleteOne
  console.log('delete user account')
})

// testing//
// app.get('/', (req, res) => {
//   let total = await client.db('testrun').collection('test123').find().toArray()
//   res.send(test123)
//  })

// when these two are typed,get is taken bcs we are only typing the url- hello world is displayed
// app.post('/', (req, res) => {
//   res.send('bye world!')
//   res.statusCode(300).send('hello')  //this line can define the status code
// })

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})

//manually add objectId here bcs for delete we put the id
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://minllii:minli0327@cluster0.zl6og2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function verifyToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, "thisisthepaskey", (err, decoded) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.identify = decoded

    next()
  })
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // let result = await client.db('testrun').collection('test123').insertOne(
    //   {
    //     total: 19.4,
    //     Name: "NEW",
    //     phone: "0927491830"
    //   }
    //   )
    // console.log(result)

    // let total = await client.db('testrun').collection('test123').find(
    // {
    //   total: 18.8
    // }).toArray()
    // console.log(total)

    // let updated = await client.db('testrun').collection('test123').updateOne(
    // { total: 20},
    // {
    //   $set: {
    //     description: 'Data Science',
    //     Semester: 2
    //   }
    // })

    // let deleted = await client.db('testrun').collection('test123').deleteOne(
    //   {
    //     _id: new ObjectId ('660b6c1c70a8150cab5a2df3')
    //   }
    // )

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  
  }
}
run().catch(console.dir);
 
