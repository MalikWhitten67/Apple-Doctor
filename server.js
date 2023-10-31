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

app.post('/train', async (req, res) => {
  let data = req.body;
  res.json(await train(data.data,data.label))
})

app.get('/status', async (req, res) => {
  res.json(await getStatus())
})

app.post('/classify', (req, res) => {
  const data = req.body;
  const url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/classify";
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data }),
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

app.get('/bulktrain', async (req, res) => {

  res.json(await persistBulkData())

})
app.listen(port, () => console.log(`Apple Doc Listening for requests on: ${port}!`));

function train(data, label) {
  return new Promise((resolve, reject) => {
    let url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/train";
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: data, label: label }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        resolve(data);
      })
      .catch((e)=>{
        reject(e)
      })
  })
  
}
function getStatus() {
  return new Promise((resolve, reject) => {
    let url = "https://machinelearningforkids.co.uk/api/scratch/" + key + "/status";

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          console.log('Error:', response.statusText);
          reject({ error: response.statusText });
        }
        return response.json();
      })
      .then(data => {
        let status = {
          2: {
            code: 200,
            indicator: 'Online - ready to use'
          },
          1: {
            code: 400,
            indicator: 'Training - not ready to use'
          },
          0: {
            code: 500,
            indicator: 'An error occured'
          },
        };
        resolve({ status: status[data.status].code, indicator:status[data.status].indicator });
      })
      .catch(error => {
        console.log(error);
        reject({ error: 'Invalid Key' });
      });
  });
}

function trainModel() {

  fetch(`https://machinelearningforkids.co.uk/api/scratch/${key}/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).then(response => response.json())

}

async function persistBulkData() {
  let isOk = false;
  try {
    const status = await getStatus()

    if (status.status === 400) {
      console.log('training')
      return { status: 400, msg: 'AI is already being trained. Please wait.' }
    } else if (status === 500) {
      return { status: 500, msg: 'An error has occurred.' }
    } else {
      console.log('ready to bulk edit')
    }

    for (let i in json.training_data) {
      let symptoms = json.training_data[i].symptoms;
      let label = json.training_data[i].label;

      // Initialize a unique label for the parent
      let parentLabel = label;

      // Loop through symptoms and create unique labels
      for (let j = 0; j < symptoms.length; j++) {
        const symptom = symptoms[j];

        // Train the symptom with its unique label
        isOk = await train(symptom, label);
      }
    }
    await trainModel();
    return { status: 200, msg: 'successfully bulk trained the ai model' }
  } catch (error) {
    console.error('An error occurred:', error);
    return { status: 501, msg: 'An error has occurred.' }
  }
}
