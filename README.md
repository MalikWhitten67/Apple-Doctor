# Apple Doctor

Apple doctor is an ai revolved app made to simplify self analysis - and workflow management,  communicating between doctors and patients

- Made by a mark cuban ai camp student.

### Tech Stack

1. [Pocketbase](https://pocketbase.com)- used for persistent reflections between patient's and Doctor's
2. Daisyui x Tailwindcss - css library making css easier and efficient.
3. React x Astro - server side rendering for fast cms
4. Express x machine learning 4 kids api - for ai to frontend communication and model training
5. Data For diseases and illnesses: https://my.clevelandclinic.org
## Dev Log

1. Oct 28th: 
   - Implemented Login / Register both as a patient and a doctor
   - Started working on the dashboard
   - Reworked Readme
2. Oct 29th: Design layout refractoring - made  the ai navigatable / consistent and easy to use
   - Doctors ui is seperate from user ui
   - Messages page done - you can create chats by searching your doctor or vice versa
     - realtime reflective messages work aswell
   - Structuring of dataset for training
       - Grabbed 5 diseases or illnesses from a-z - writing severity level and using concice prompts




## Dataset layout

* Disease/illness labeling
   - Each disease or illness is labled  - so that the ai can categorize the symptoms to which you have
* Symptoms array
   - Common symptoms or possible symptoms that may match what you are feeling - this consists of short concise input prompts that best give you a correct output
* severity
   - Ranging between:
      - Severe: you need to see a doctor asap
      - Watch: keep in contact with a doctor and watch incase it worsens
      - Mild: you can possibly take care of this at home with over the counter meds or just incase it gets worse stay in contact with a doctor



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


