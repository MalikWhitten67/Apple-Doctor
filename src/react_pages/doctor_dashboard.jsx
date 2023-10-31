import { useEffect, useState } from "react";
import { api } from ".";
import Nav from "../components/react/nav";
import Bottomnav from "../components/react/bottomnav";

export default function Dashboard() {
  if (!api.authStore.isValid) window.location.href = "/login";
  if (api.authStore.isValid && !api.authStore.model.isDoctor)
    window.location.href = "/dash_user";
  let [output, setOutput] = useState(null);
  useEffect(() => {
    api.collection("doctors").authRefresh();
    fetch("https://expressjs.malikwhitten.repl.co/").then((res) => {
      if (!res.ok) alert("Server is down");
      console.log("Server is up");
    });
  }, []);
  return (
    <div className="p-2  font-sans   h-screen  xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] ">
      <Nav />
      <div className="mt-8 mb-16">
        <div className="card mt-2  border">
          <div className="card-body">
            <h2 className="card-title">
              Ai Analysis <span className="text-sm text-gray-500">- Beta</span>
            </h2>
            <p className="text-sm">
              Enter patient complications ie: symtoms, pain ratio, etc and we
              will try to diagnose them.
            </p>

            <textarea
              className="textarea h-24  resize-none textarea-bordered w-full"
              placeholder="Enter Data seperated by a comma name, age,symtoms given"
            ></textarea>
            {output ? (
              <button className="btn btn-sm rounded-full bg-blue-500 hover:bg-blue-500 text-white mt-2">
                Send To Doctor
              </button>
            ) : (
              <button
                onClick={() => setOutput("output")}
                className="btn btn-sm rounded-full  bg-blue-500  text-white hover:bg-blue-500 mt-2"
              >
                Analyze
              </button>
            )}
          </div>
        </div>
      </div>
      <Bottomnav />
    </div>
  );
}
