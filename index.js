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
        const usersCollection = client.db('ExpenseTracker').collection('users')


        // app.get("/delete", async (req, res) => {

        //     const query = {}
        //     const result = await catagoryCollections.deleteMany(query)
        //     res.send(result)

        // })

        app.put("/user/:email", async (req, res) => {
            try {
                const email = req.params.email;

                // check the req
                const query = { email: email }
                const existingUser = await usersCollection.findOne(query)

                if (existingUser) {


                    return res.send({})
                }

                else {

                    const user = req.body;
                    const filter = { email: email };
                    const options = { upsert: true };
                    const updateDoc = {
                        $set: user
                    }
                    const result = await usersCollection.updateOne(filter, updateDoc, options);

                    // token generate 


                    return res.send(result)

                }

            }
            catch (err) {
                console.log(err)
            }
        })

        // Adding Catagories
        app.post('/addcatagory', async (req, res) => {
            const body = req.body;
            const result = await catagoryCollections.insertOne(body)
            res.send(result)
        })

        // Catagories by user

        // Reading the catagory Data
        app.get('/catagories', async (req, res) => {
            const email = req.query.email
            const query = { userEmail: email }
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


        // delete catagory 
        app.delete('/deletecatagory/:id', async (req, res) => {

            const id = req.params.id

            const query = { _id: new ObjectId(id) }
            const result = await catagoryCollections.deleteOne(query)
            res.send(result)

        })

        app.put('/editexpense/:id', async (req, res) => {
            const id = req.params.id
            const body = req.body
            const expenseId = req.body.expenseID
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const clickedCatagory = await catagoryCollections.findOne(query)

            console.log('id',expenseId)
            console.log('body',body)
          
            const updatedObject = clickedCatagory.expenses.map((obj, i) => {

                if (obj.id=== expenseId) {

                    obj.remove = false
                    obj.expense = body.newExpenseBudget
                    obj.title = body.newExpenseTitle
                 
                }
                return obj;
            })



            const updateDoc = {
                $set: {
                    expenses: updatedObject,
                   
                }
            }
            const result = await catagoryCollections.updateOne(query, updateDoc, option)
            res.send(result)


        })

        // Remove Expense
        app.put('/removeexpense/:id', async (req, res) => {
            const id = req.params.id
            const expenseId = req.body.expenseID
            const body =req.body
            console.log(body)
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const clickedCatagory = await catagoryCollections.findOne(query)

          
            const updatedObject = clickedCatagory.expenses.map((obj, i) => {

                if (obj.id === expenseId) {
                    obj.remove = 'true';

                }
                return obj;
            })

         

            const updateDoc = {
                $set: {
                    expenses: updatedObject,

                }
            }
            const result = await catagoryCollections.updateOne(query, updateDoc, option)
            res.send(result)



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