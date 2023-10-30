import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
import fs from 'fs'
app.use(cors());
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'online' }));
let config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
let json = JSON.parse(fs.readFileSync(config.dataset, 'utf-8'))
let rated_confidence = config.rated_confidence
let min_confidence = config.min_confidence
let hastrained = false
let password = process.env['admin_password']
const key = process.env['api_key']

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

app.get('/status', (req, res) => {
  let url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/status"
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },

  }).then(response => {
    if (!response.ok) {
      console.log('Error:', response.statusText)
      return res.send({ error: response.statusText })
    }
    return response.json()
  })
    .then((data) => {
      console.log(data)
      let status = {
        2: "Online",
        1: "Training in Progress",
        0: "Issue present please try again"
      }
      res.send({ status: status[data.status] })
    })
    .catch((e) => {
      console.log(e)
      res.send({ error: 'Invalid Key' })
    })
})

app.post('/classify', (req, res) => {
  const data = req.body;
  const url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/classify";
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data.data }),
  })
    .then(response => response.json())
    .then(data => {
      let bestResult = null;

      data.forEach(element => {
        const class_name = element.class_name;
        const confidence = element.confidence;
        const trainingData = json.training_data.find(x => x.label === class_name);

        if (!bestResult || confidence > bestResult.confidence) {
          bestResult = {
            illness_or_disease: class_name,
            severity: trainingData.severity,
            confidence: confidence,
            description: trainingData.description,
            image: trainingData.image,
            suggestion: trainingData.suggestion,
            common_symptoms: trainingData.common_symptoms
          };
        }
      });

      if (bestResult) {
        console.log(bestResult);
        res.send(bestResult);
      } else {
        res.send({
          error: `Please consult your doctor if it is severe. The illness/disease cannot be found in my dataset!`,
          confidence: 0, // Set confidence to 0 or another appropriate value
          code: 200
        });
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      res.send({ error: 'an error occurred' });
    });

});

app.get('/dash', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname + '/admin_dash/dash.html'))
})

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
function trainModel() {

  fetch(`https://machinelearningforkids.co.uk/api/scratch/${key}/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
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

function persistBulkData() {
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
