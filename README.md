# Apple Doctor

Apple doctor is an ai revolved app made to simplify self analysis - and workflow management,  communicating between doctors and patients

- Made by a mark cuban ai camp student aka me!!!.

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
   - go to [machine_learning_4kids](machinelearningforkids.co.uk) and click try it - then create a new project and fill 2 labels with data from `data.json`
        - the data you fill in is the symptoms copy each symptom inside of " " then apply it to the label.
        -  go back and select test and train your model

   - Dowload the backend code from the backend branch then continue to do the following:
       

   - Next click make - python and then copy your api key -> your then going to place key inside of .env file
     
     ```env
     api_key=key
     ```
  - or if using [replit](https://replit.com/@MALIKWhitten/Apple-Doctor-backend) then refer to secrets -> click the three dots next to api_key and replace it with your own
    ![Replit](https://github.com/MalikWhitten67/Apple-Doctor/assets/65188863/9a75d59b-6884-40fe-bd23-9a002eb09512)
    Skip the next few if you are using replit
    
  - Download the dataset from branch backend and then create a config.json file in the main dir where server.js is located
  ```json
  {
    "min_confidence":"20",
   "rated_confidence":"60",
   "dataset":"./data.json"
  }
  ```
  - Now you can run server.js which sets up all endpoints
  - You can check the status of the model on the [status page](http://127.0.0.1:3000/status)
  - When you get to the frontend portion be sure to swap the api url for analyzing requests with yours! 
    
* Database
   - Pretty simple go to [pocketbase website](https://pocketbase.com) download the latest version run the following command || you can use [Pockethost](https://pockethost.io) which can host it for free on their servers
     
    - To start the server run the following in terminal either windows or linux:

    ```bash
     pocketbase serve
     ```
    
   - goto [admin panel](http://127.0.0.1:8090/_/) || `https://your_pockethost_api_route.pockethost.io/_/` - and finish installment
 
    
   - Now that you have an database swap to backend branch go into pocketbase folder and download the schema
   - Go back to your panel - then settings and under import collections either click to upload the file or copy and paste
     
* Run the frontend
    - Download the code and do the following
    - Swap the api route to your url
      - ```js
     const api = new Pocketbase(`https://replace_with_url/`) // do not include /_/ or /api just the base route `https://route`
     ```
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
     - Cleaned the ui for pc users
     - Made it so you cannot create duplicated chats
     - Added chat deletion option - and send to doctor button works
     - Added bulk label updates allowing you to append data to multiple labels from the dataset all at once and auto train the model

4. Oct 31st
    - Did alot of ui fixes and enhancements
    - Added more data to the database cleaned up the dataset to be more accurate for both doctors and regular users
    - Implemented Attachments in messages allowing users to send their assements as an attachment inwhich shows as a card in the chat
    - Bug fixes on the backend & frontend
      
5.  Nov 1st - 3rd
    - Implemented doctor and user profile editing avatars and more
    - Finished settings page
    - Added message deleting by hovering
    - Fixes to message ui
    - Published the website to be presented
