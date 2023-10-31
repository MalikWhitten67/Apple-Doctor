# Apple Doctor

Apple doctor is an ai revolved app made to simplify self analysis - and workflow management,  communicating between doctors and patients

- Made by a mark cuban ai camp student.

### Tech Stack

1. [Pocketbase](https://pocketbase.com)- used for persistent reflections between patient's and Doctor's
2. Daisyui x Tailwindcss - css library making css easier and efficient.
3. React x Astro - server side rendering for fast cms
4. Express x machine learning 4 kids api - for ai to frontend communication and model training
5. Data For diseases and illnesses: https://my.clevelandclinic.org

 
 
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
* Image
    - Some illnesses / diseases have images - this is just used to better understand what they may have

* Suggestions
    - These are tips at what action you should take depending on how severe the illness/disease is.
      
* Common Symptoms
    - This is a list of symptoms that are prevalent to the illness/disease - this is for the frontend


## Ai Api reference
 
* GET -> https://expressjs.malikwhitten.repl.co/
   - out: Status page

* POST -> https://expressjs.malikwhitten.repl.co/classify
   - Body -> data:'text prompt'
   - Out: -> Category/label /confidence / description

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


