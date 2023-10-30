import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
const app = express();
import fs from 'fs'
app.use(cors());
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'online' }));

let json = JSON.parse( fs.readFileSync('./data.json' , 'utf8'))
let key = "9f458de0-76c3-11ee-9ee4-af9bcaa4af0b51d5f396-70ad-4615-86af-fe5a2c62d6d7"
let hastrained = false
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

         data.forEach(element => {
           res.send(element.confidence > 60 || element.confidence < 60 && element.confidence > 20 ? {
             illeness_or_disease:element.class_name,
             severity:json.training_data.find(x => x.label == element.class_name).severity,
             confidence:element.confidence,
             description:json.training_data.find(x => x.label == element.class_name).description
           }: `Please follow up with your doctor if it is severe - I cannot find the given illness/disease you may contain from my dataset!`)

         });
       })
       .catch((error) => {
         console.error('I am whining', error);
       });
  
});

app.listen(port, () => console.log(`Apple Doc Listening for requests on: ${port}!`));

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
function trainModel(){
 
     fetch(`https://machinelearningforkids.co.uk/api/scratch/${key}/models`,{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ }),
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

function persistBulkData(){
  for (var i in json.training_data) {
    let symptoms = json.training_data[i].symptoms;
    let label = json.training_data[i].label;

    // Initialize a unique label for the parent
    let parentLabel = label;

    // Loop through symptoms and create unique labels
    for (let j = 0; j < symptoms.length; j++) {
      const symptom = symptoms[j];


      // Train the symptom with its unique label
      train(symptom, label)
    }
  }

}
