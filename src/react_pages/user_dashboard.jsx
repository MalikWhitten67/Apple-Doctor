import { useEffect, useRef, useState } from "react";
import { api } from ".";
import Nav from "../components/react/nav";
import Bottomnav from "../components/react/bottomnav";

export default function Dashboard() {
  if (!api.authStore.isValid) window.location.href = "/login";
  let [output, setOutput] = useState(null);
  let [text, setText] = useState("");
  let [loading, setLoading] = useState(false);
  let [ai_output, setAi_output] = useState(null);
  let [analysis, setAnalysis] = useState(null);
  let [error, setError] = useState(false);
  let textinput = useRef();
  let outputRef = useRef();
  useEffect(() => {
    if (api.authStore.model.isDoctor) window.location.href = "/dash_doctor";
    api.collection("users").authRefresh();
    fetch("https://expressjs.malikwhitten.repl.co/").then((res) => {
      if (!res.ok) alert("Server is down");
      console.log("Server is up");
    });
  }, []);
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  function analyze_symptoms(text) {
    if (text === "") {
      alert("please input text to analyze");
      return;
    }
    setLoading(true);
    fetch("https://expressjs.malikwhitten.repl.co/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: text }),
    })
      .then((response) => {
        if (!response.ok) {
          alert("please try again");
          setLoading(false);
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError(true);
          setLoading(false);
          return;
        }
        setAi_output(data);
        setLoading(false);
        outputRef.current.showModal();
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${day}-${month}-${year}`;

        setAnalysis(
          `symptoms: ${text}\ndate_accessed: ${currentDate}\nillness: ${data?.illness_or_disease}\nlinked_illnesses:${data?.linked_illnesses}\nseverity: ${data.severity}\nai_confidence:${data.confidence}`,
        );
      })
      .catch((e) => {
        setLoading(false);
        alert("Error Occured");
      });
  }
  return (
    <div className=" p-2 font-sans xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto ">
      <Nav />

      <div className="mt-8 mb-16">
        <div className="card mt-2  border">
          <div className="card-body">
            <h2 className="card-title">Ai Diagnosis</h2>
            <p className="text-sm">
              Enter how you feel, what is affecting you and we will try to
              diagnose you. You can send your diagnosis to a doctor for
              confirmation.
            </p>
            <div className="relative">
              <textarea
                ref={textinput}
                onChange={(e) => setText(e.target.value)}
                className="textarea h-24  resize-none textarea-bordered w-full"
                placeholder="Enter Symptoms: e.g. I have a headache, I feel dizzy, I have a fever"
                {...(analysis ? { disabled: true } : { disabled: false })}
              ></textarea>
              {analysis ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 absolute bottom-3 z-[9999] right-2  "
                  onClick={() => {
                    setAi_output(null);
                    setAnalysis(null);
                    textinput.current.value = "";
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-col"></div>
            {ai_output ? (
              <div>
                <button className="btn   w-full bg-blue-500 hover:bg-blue-500 text-white mt-2">
                  Send To Doctor
                </button>
                <button
                  className="btn  w-full   bg-blue-500 hover:bg-blue-500 text-white mt-2"
                  onClick={() => {
                    outputRef.current.showModal();
                  }}
                >
                  Review Summary
                </button>
              </div>
            ) : (
              <button
                onClick={() => analyze_symptoms(text)}
                className="btn btn-sm rounded-full flex hero  bg-blue-500  text-white hover:bg-blue-500 mt-2"
              >
                Analyze{" "}
                {loading ? (
                  <div className="loading loading-spinnner loading-sm"></div>
                ) : (
                  ""
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <dialog ref={outputRef} className="modal    ">
        <div className=" bg-white flex-col gap-5   xl:modal-box lg:modal-box   p-5 xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto  h-screen  overflow-x-auto ">
          <div className="flex flex-row hero   justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              onClick={() => {
                outputRef.current.close();
              }}
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 cursor-pointer h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <p className="text-lg font-semithin text-sans">
              Ai Analysis Summary
            </p>

            <div></div>
          </div>

          <div className="flex flex-col text-md font-sans mt-8 ">
            <div className=" gap-2 bg-yellow-400     mx-2 font-normal  p-2 rounded   flex text-sm prose">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12     h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <p>
                If symptoms ranked severe or you feel worse than normal{" "}
                <a href="/message" className="text-blue-600 link">
                  contact your doctor!
                </a>
              </p>
            </div>
            <div className="card w-full p-0 bg-base-100  mt-8">
              <figure className="rounded">
                {ai_output?.image ? (
                  <img
                    className="rounded"
                    src={ai_output?.image}
                    alt={ai_output?.illness_or_disease}
                  />
                ) : (
                  ""
                )}
              </figure>
              <div className="  mt-8 flex flex-col gap-2">
                <div className="flex flex-col ">
                  <h2 className="card-title capitalize  flex">
                    Linked illness or Disease: {ai_output?.illness_or_disease}
                  </h2>
                  {ai_output?.severity == "severe" ? (
                    <span className="mt-2 border rounded-full   text-white bg-error  badge ">
                      severe!
                    </span>
                  ) : ai_output?.severity == "watch" ? (
                    <span className="mt-2 border rounded-full   text-white bg-blue-500  badge ">
                      Watch!
                    </span>
                  ) : (
                    <span className="mt-2 border rounded-full   border-slate-200  badge-ghost text-black  badge ">
                      mild!
                    </span>
                  )}
                </div>

                <label className="mt-2">Specified Symptoms:</label>
                <p>{text}</p>
                <div className="divider"></div>

                <label className="mt-2">Common Symptoms:</label>
                <p>{ai_output?.common_symptoms}</p>
                <div className="divider"></div>
                <span className="  bg-sky-200 shadow  p-2  rounded hero flex gap-5 prose">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  Linked illnesses are only given to show what can also cause it
                </span>
                <label className="mt-2">Linked Illnesses:</label>
                <p>{ai_output?.linked_illnesses}</p>
                <div className="divider"></div>

                <label className="mt-2">Description:</label>
                <div className="flex">
                  <p className="font-normal text-md">
                    {ai_output?.description}
                  </p>
                </div>
                <div className="divider"></div>
                <label className="mt-2">Suggestion:</label>
                <p>{ai_output?.suggestion}</p>
                <div className="divider"></div>
                <div className="card-actions mt-5  mb-12 xl:mb-0 lg:mb-0 flex  w-full">
                  <div className="hero flex  justify-between">
                    <p className="btn btn-ghost capitalize p-0 pointer-events-none hover:bg-transparent focus:bg-transparent cursor-text bg-transparent justify-start font-semibold flex">
                      <span className="cursor-text">
                        {" "}
                        Download an assessmemt{" "}
                      </span>
                    </p>
                    <span
                      {...(analysis
                        ? {
                            className:
                              "btn btn-circle btn-ghost flex justify-center mx-auto absolute end-0  z-[9999]  mt-18",
                          }
                        : {
                            className:
                              "btn btn-circle pointer-events-none btn-ghost opacity-50 flex absolute end-0   z-[9999] mt-18",
                          })}
                      onClick={() => {
                        if (analysis) {
                          download(analysis, "assessment.txt", "text/plain");
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </span>
                  </div>
                  <button className="btn bg-blue-500 text-white w-full  ">
                    Send To your Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <Bottomnav />
    </div>
  );
}
