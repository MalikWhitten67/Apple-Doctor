# Apple Doctor

Apple doctor is an ai revolved app made to simplify self analysis - and workflow management,  communicating between doctors and patients

- Made by a mark cuban ai camp student.

### Tech Stack

1. Pocketbase - used for persistent reflections between patient's and Doctor's
2. Daisyui x Tailwindcss - css library making css easier and efficient.
3. React x Astro - server side rendering for fast cms
4. Express x machine learning 4 kids api - for ai to frontend communication and model training


## Running/Installing

```bash
npm i
```

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


