const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ny61p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const activitiesCollection = client.db("volunteerNetwork").collection("activities");
  const eventsCollection = client.db("volunteerNetwork").collection("events");

  app.get('/getAllActivities', (req, res) => {
    activitiesCollection.find({}).toArray((error, documents) => res.send(documents));
  })

  app.get('/activity/:id', (req, res) => {
    const { id } = req.params;
    activitiesCollection.find({ _id: ObjectId(id) }).toArray((error, documents) => res.send(documents[0]));
  })

  app.post('/addEvent', (req, res) => {
    const body = req.body;
    eventsCollection.insertOne(body).then(result => res.send(result));
  })

  app.get('/userAllEvents', (req, res) => {
    const { email } = req.query;
    eventsCollection.find({email}).toArray((error, documents) => res.send(documents))
  })

  app.get('/deleteEvent/:id', (req, res) => {
    const { id } = req.params;
    eventsCollection.deleteOne({_id: ObjectId(id)}).then(result => res.send(result));
  })

  app.get('/getAllEvents', (req, res) => {
    eventsCollection.find({}).toArray((error, documents) => res.send(documents));
  })
});


app.listen(process.env.PORT || 4000);