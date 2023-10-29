import { useEffect, useState } from "react";
import { api } from ".";
import Nav from "../components/react/nav";
import Bottomnav from "../components/react/bottomnav";

export default function Dashboard() {
    if (!api.authStore.isValid) window.location.href = '/login'
    let [output, setOutput] = useState(null)
    useEffect(() => {
        if(api.authStore.model.isDoctor) window.location.href = '/dash_doctor'
        api.collection("users").authRefresh()
        fetch('https://expressjs.malikwhitten.repl.co/')
        .then(res =>  {
            if(!res.ok) alert('Server is down');
            console.log('Server is up')
        })
    }, [])
    return (<div className=" p-2 font-sans ">
        <Nav />
        <div className="mt-8 mb-16">



            <div className="card mt-2  border">

                <div className="card-body">
                    <h2 className="card-title">
                        Ai Diagnosis
                    </h2>
                    <p className="text-sm">
                        Enter how you feel, what is affecting you and we will try to diagnose you.
                        You can send your diagnosis to a doctor for confirmation.
                    </p>


                    <textarea className="textarea h-24  resize-none textarea-bordered w-full" placeholder="Enter Symptoms: e.g. I have a headache, I feel dizzy, I have a fever"></textarea>
                    {
                        output ? <button className="btn btn-sm rounded-full bg-blue-500 hover:bg-blue-500 text-white mt-2">Send To Doctor</button>
                            : <button
                                onClick={() => setOutput("output")}
                                className="btn btn-sm rounded-full  bg-blue-500  text-white hover:bg-blue-500 mt-2">Analyze</button>
                    }


                </div>
            </div>
 
        </div>
        <Bottomnav />
    </div>
    )
}