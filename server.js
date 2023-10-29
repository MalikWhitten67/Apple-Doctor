import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
const app = express();
import fs from 'fs'
app.use(cors());
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'online' }));

let key = "api key"
app.post('/train', (req, res) => {

  let url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/train";
  let data = req.body;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data.data, label: data.label }),
  }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      res.send(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.send(error);
    });
})
app.get('/', (req, res) => {
  res.send('Ai Backend Working')
})

app.post('/classify', (req, res) => {
  let data = req.body;

  let url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/classify";
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data.data }),
  }).then(response => response.json())
    .then(data => {
      console.log(data)
      data.forEach(element => {
        if (element.confidence > 60) {
          res.send(element.class_name);
        }
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.send(error);
    });
});

app.listen(port, () => console.log(`Reading Requests from ${port}!`));

function train(data, label) {
  fetch('http://localhost:3000/train', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data, label: label }),
  }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
}

function classify(data) {
  fetch('http://localhost:3000/classify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data }),
  }).then(response => response.text())
    .then(data => {
      console.log('Success:', data);
    })
}

let json = JSON.parse( fs.readFileSync('./data.json' , 'utf8'))
json.training_data.forEach((i)=>{
  i.data.forEach((d)=>{
    train(d,i.label)
  })
})
 
