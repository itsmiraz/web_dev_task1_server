require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpgnyx0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const catagoryCollections = client.db('ExpenseTracker').collection('catagory')




        // Adding Catagories
        app.post('/addcatagory', async (req, res) => {
            const body = req.body;
            const result = await catagoryCollections.insertOne(body)
            res.send(result)
        })

        // Reading the catagory Data
        app.get('/catagories', async (req, res) => {
            const query = {}
            const result = await catagoryCollections.find(query).toArray()
            res.send(result)
        })
       
        // Add Expense
        app.put('/addexpense/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body
            const filter = { _id: new ObjectId(id) }
            console.log(body)
           const expenseCatagory = await catagoryCollections.findOne(filter)
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    expenses: [...expenseCatagory.expenses, body],
                    expense: body.newexpense
                }
            }
            const result = await catagoryCollections.updateOne(filter, updateDoc, option)
            res.send(result)


        })


        // Remove Expense
        app.put('/removeexpense/:id?expenseId', async (req, res) => {
            const id = req.params.id
            const expenseId = req.params.expenseId
        })

    }
    catch {

    }
    finally {

    }
}

run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello Word')

})
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})