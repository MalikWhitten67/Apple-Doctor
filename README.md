# Apple Doctor

Apple doctor is an ai revolved app made to simplify self analysis - and workflow management,  communicating between doctors and patients

- Made by a mark cuban ai camp student.

### Tech Stack

1. Pocketbase - used for persistent reflections between patient's and Doctor's
2. Daisyui x Tailwindcss - css library making css easier and efficient.
3. React x Astro - server side rendering for fast cms
4. Express x machine learning 4 kids api - for ai to frontend communication and model training


## Running/Installing

1. Install all frontend dependencies used for development

```bash
npm i
```

* Setting up backend
   - go to [machine_learning_4kids](machinelearningforkids.co.uk) and click try it - then create a new project and fill 2 labels with data
   - Next click make - python and then copy your api key -> your then going to place key inside of .env file
     
     ```env
     api_key=key
     ```
  - Now you can run server.js which sets up all endpoints
    
* Database
   - Pretty simple go to [pocketbase website](https://pocketbase.com) download the latest version run the following command
     
     ```bash
     pocketbase serve
     ```
   - goto [admin panel](127.0.0.1:8090/_/) - and finish installment
   - Swap the api url in the index.jsx file to yours
   - Now that you have an database swap to backend branch go into pocketbase folder and download the schema
   - Go back to your panel - then settings and under import collections either click to upload the file or copy and paste
   - Your done! that was easy now we need to just run the frontend
     
    ```bash
     npm run dev
    ```




# Dev Log

1. Oct 28th: 
   - Implemented Login / Register both as a patient and a doctor
   - Started working on the dashboard
   - Reworked Readme
2. Oct 29th: Design layout refractoring - made  the ai navigatable / consistent and easy to use
   - Doctors ui is seperate from user ui
   - Messages page done - you can create chats by searching your doctor or vice versa
     - realtime reflective messages work aswell
     - grabbing useful data for accessments - analyzing data from reputable sources and making useful prompts to better get a quality answer.
     - Optimized ai backend api to better give an answer based on median confidency rating
3. Oct 30th:
     - Finished working on analysis output / analyzing for user dashboard
     - Reorganized / fixed dataset inconsistencies by using concise inputs
     - small bug fixes on backend
     - Proper ui sizing for pc monitors
     - Adding common symptoms to datasets for users to view - to get a general understanding of the disease/illness
     - Adding suggestions - which can tell if a user can do it at home or if they should contact their doctor about the issue








## Ai Api reference
 
* GET -> https://expressjs.malikwhitten.repl.co/
   - out: Status page

* POST -> https://expressjs.malikwhitten.repl.co/classify
   - Body -> data:'text prompt'
   - Out: -> Category/label /confidence

* POST -> https://expressjs.malikwhitten.repl.co/train
  - Body 
    - label: 'label it belongs to',
    - data: 'text to be used to best categorize a prompt'
  - Out: 
    - Success: has been added to the label


## App api reference

### Doctors

Login: apple-doctor.pockethost.io/api/collections/doctors/auth-with-password
  - Method: Post
  - Returns: record auth data / error
  - Expects -> password and email

Register: Login: apple-doctor.pockethost.io/api/collections/doctors/auth-with-password
   - Method: Post
   - Returns: success message or error
   - Expects: password, confirmedpassword name, email, boolean isDoctor


