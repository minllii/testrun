const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req, res) => {
   res.send('Hello World!!')
})

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
  
  }
}
run().catch(console.dir);

