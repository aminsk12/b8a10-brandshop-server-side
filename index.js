const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middlewear
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kcvdpep.mongodb.net/?retryWrites=true&w=majority`;


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
        await client.connect();

        const itemCollection = client.db('itemDB').collection('item');
        const userCollection = client.db('itemDB').collection('user');


        app.get('/item', async (req, res) => {
            const cursor = itemCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await itemCollection.findOne(query);
            res.send(result);
        })


        app.post('/item', async (req, res) => {
            const newItem = req.body;
            console.log(newItem);
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })


        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedItem = req.body;
            const item = {
                $set: {
                    image: updatedItem.image,
                    name: updatedItem.name,
                    brand: updatedItem.brand,
                    type: updatedItem.type,
                    price: updatedItem.price,
                    description: updatedItem.description,
                    rating: updatedItem.rating
                }
            }
            const result = await itemCollection.updateOne(filter, item, options);
            res.send(result);
        })

        


        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('product server is running')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})













