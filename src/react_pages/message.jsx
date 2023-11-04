import { useEffect, useRef, useState } from "react";
import { api } from ".";
import { chunkToByteArray } from "../../node_modules/astro/dist/runtime/server/render/common";
import Bottomnav from "../components/react/bottomnav";
api.autoCancellation(false);
export default function Message() {
  let [messages, setMessages] = useState([]);
  let [isDoctor, setIsDoctor] = useState(api.authStore.model.isDoctor);
  let compose = useRef();
  let [search, setSearch] = useState(null);
  let chat = useRef();
  let message_input = useRef();
  let [isIndex, setIsIndex] = useState(false);
  let [searched, setSearched] = useState(null);
  let [loading, setLoading] = useState(false);
  let [chats, setChats] = useState([]);
  let [currentChat, setCurrentChat] = useState(null);
  useEffect(() => {
    function debounce(func, timeout = 300) {
      let timer;
      isIndex = true;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
          setIsIndex(false);
        }, timeout);
      };
    }
    if (!isIndex) {
      api
        .collection(api.authStore.model?.isDoctor ? "users" : "doctors")
        .getFirstListItem(
          search?.includes("@") ? `email="${search}"` : `name~"${search}"`,
        )
        .then((res) => {
          setSearched(res);
        })
        .catch((err) => {
          setSearched(false);
        });
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    api
      .collection("chats")
      .getList(1, 100, {
        filter: isDoctor
          ? `doctor="${api.authStore.model.id}"`
          : `user="${api.authStore.model.id}"`,
        sort: "-created",
        expand: "user,doctor,messages",
      })
      .then((res) => {
        console.log(res);
        setChats(res.items);
        setLoading(false);
      });
  }, []);

  function createChat() {
    let form = new FormData();
    let d_id = isDoctor ? api.authStore.model.id : searched.id;
    let user_id = isDoctor ? searched.id : api.authStore.model.id;
    form.append("doctor", d_id);
    form.append("user", user_id);
    api
      .collection("chats")
      .create(form, {
        expand: "user,doctor",
      })
      .then((res) => {
        compose.current.close();
        setChats([...chats, res]);
      })
      .catch((e) => {
        let error = e.data.data;
        if (
          error.doctor.code == "validation_not_unique" &&
          error.user.code == "validation_not_unique"
        ) {
          alert("already a chat created with given user");
          compose.current.close();
          let chat = chats.filter((c) => {
            return c.doctor == d_id && c.user == user_id;
          });
          getChat(chat[0].id);
        }
      });
  }

  function getChat(id) {
    api
      .collection("chats")
      .getOne(id, {
        expand: "user,doctor,messages",
      })
      .then((res) => {
        setCurrentChat(res);

        chat.current.showModal();
      });

    api
      .collection("messages")
      .getList(1, 100, {
        filter: `chat="${id}"`,
        sort: "created",
      })
      .then((res) => {
        setMessages(res.items);
      });

    api.collection("messages").subscribe("*", (res) => {
      if (
        res.action === "create" &&
        res.record.chat === id &&
        res.record.sent_by !== api.authStore.model.id
      ) {
        setMessages((messages) => [...messages, res.record]);
      }
    });
  }

  function sendMessage(userid, content) {
    let l_data = {
      doctor: isDoctor ? api.authStore.model.id : userid,
      user: isDoctor ? userid : api.authStore.model.id,
      message: content,
      sent_by: api.authStore.model.id,
      chat: currentChat.id,
    };
    const data = {
      user: l_data.user,
      doctor: l_data.doctor,
      messages: currentChat.messages,
    };

    api
      .collection(`messages`)
      .create(l_data)
      .then(async (res) => {
        message_input.current.value = "";
        compose.current.close();
        setMessages((messages) => [...messages, res]);
      });
  }
  window.onbeforeunload = function () {
    api.collection("messages").unsubscribe("*");
  };

  function del(collection, id) {
    api
      .collection(collection)
      .delete(id)
      .then(() => {
        if (collection == "messages") {
          setMessages(messages.filter((x) => x.id != x.id));
        } else if (collection == "chats") {
          setChats(chats.filter((x) => x.id != x.id));
        }
      });
  }
  return (
    <div className=" w-full h-full">
      <div className="navbar bg-base-100 w-full xl:w-[40vw] xl:justify-center xl:mx-auto lg:w-[40vw] lg:justify-center lg:mx-auto">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl pointer-events-none">
            Chat
          </a>
        </div>
        <div></div>
        <div className="flex-none">
          <svg
            onClick={() => compose.current.showModal()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>
      </div>

      <div className="flex relative flex-col gap-5  p-2   w-full mt-4 xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto">
        {chats.length > 0 && !loading ? (
          chats.map((chat) => {
            console.log(chat);
            return (
              <div
                key={chat.id}
                className="flex flex-col cursor-pointer w-full  "
              >
                <div className="flex hero  ">
                  <div className="avatar online placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                      <span className="text-xl">
                        {isDoctor
                          ? chat.expand?.user.name[0]
                          : chat.expand?.doctor.name[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between font-semibold w-full">
                    <div className="flex flex-col mx-2">
                      <p onClick={() => getChat(chat.id)}>
                        {isDoctor
                          ? chat.expand?.user.name
                          : chat.expand?.doctor.name}
                      </p>
                      <p className="text-sm opacity-50">
                        {isDoctor
                          ? chat.expand?.user.email
                          : chat.expand?.doctor.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className="  absolute end-3  "
                    onClick={(e) => del("chats", chat.id)}
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        ) : chats.length < 1 && !loading ? (
          <div className="p-2 mt-8 flex flex-col mx-2">
            <p>
              {" "}
              You have no messages, click{" "}
              <span
                onClick={() => compose.current.showModal()}
                className="text-blue-500"
              >
                here
              </span>{" "}
              to start a conversation with {isDoctor ? "a patient" : "a doctor"}
            </p>
          </div>
        ) : (
          <span className="loading loading-spinner-large mx-auto mt-8"></span>
        )}
      </div>

      <dialog
        ref={compose}
        className="modal  w-full xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto "
      >
        zf
        <div className="   relative bg-white h-full p-5 w-full  xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto ">
          <div className="flex flex-row hero justify-between">
            <svg
              onClick={() => compose.current.close()}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <p className="mx-2 mt-">
              Choose a {isDoctor ? "patient" : "doctor"} to chat with.
            </p>
            <div></div>
          </div>

          <label className="label mt-6">
            <span className="label-text text-lg font-bold">To</span>
          </label>
          <input
            className="input rounded-full input-sm w-full input-bordered"
            type="text"
            placeholder="Search by Email Address or Name"
            onChange={(e) => setSearch(e.target.value)}
          />

          {searched ? (
            <div className="flex  hero justify-between gap-2 mt-6">
              <div className="flex flex-row hero gap-3">
                <div className="avatar   placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                    <span className="text-xl">{searched.name[0]}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="font-bold">{searched.name}</p>
                  <p className="text-sm">{searched.email}</p>
                </div>
              </div>
              <div class="form-control  ">
                <label class="cursor-pointer label  ">
                  <input
                    type="checkbox"
                    class="checkbox "
                    onChange={(e) => {
                      setSearched({ ...searched, checked: e.target.checked });
                    }}
                  />
                </label>
              </div>
            </div>
          ) : null}

          <button
            {...(searched?.checked
              ? {
                  className:
                    "btn absolute inset-x-0 hover:bg-blue-500 bottom-5 w-5/6 left-0 rounded-full mx-auto justify-center flex  bg-blue-500 text-white ",
                }
              : {
                  className: "hidden",
                })}
            onClick={createChat}
          >
            {searched ? `Send Message to ${searched.name}` : `Create Chat`}
          </button>
        </div>
      </dialog>
      <dialog
        ref={chat}
        className="modal  w-full xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[40vw] lg:justify-center lg:mx-auto"
      >
        <div className=" bg-white p-3 mb-6 w-full xl:w-[30vw] xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto  h-screen rounded overflow-auto">
          <div className="flex   justify-between mb-12 h-12 bg-white z-[999]">
            <svg
              onClick={() => {
                chat.current.close();
                api.collection("messages").unsubscribe("*");
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <p className="mx-2  ">
              {currentChat
                ? `${
                    isDoctor
                      ? currentChat.expand?.user.name
                      : currentChat.expand?.doctor.name
                  }`
                : null}
            </p>
            <div></div>
          </div>
          <div className="flex flex-col  gap-2 mb-12 mt-12  p-2">
            {currentChat && messages.length > 0 ? (
              messages.map((message) => {
                return (
                  <div key={message.id}>
                    {message.sent_by === api.authStore.model.id ? (
                      <div className="chat relative chat-end mb-6">
                        <div className="chat-image avatar w-10  rounded-full border border-1 border-base-300 ">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-10">
                              <span className="text-xl capitalize">
                                {api.authStore.model.name[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="chat-header">
                          You!
                          <time className="text-xs opacity-50 mx-2">
                            {new Date(message.created)
                              .toLocaleTimeString()
                              .split(":")[0] +
                              ":" +
                              new Date(message.created)
                                .toLocaleTimeString()
                                .split(":")[1]}
                          </time>
                        </div>

                        {message?.isAttatchment ? (
                          <div class="card w-5/6   bg-base-100 shadow rounded border-base-200 border-1">
                            <div className="p-3">
                              <p>Attatchement</p>
                              <p>{message.message}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="chat-bubble">{message.message}</div>
                        )}
                      </div>
                    ) : (
                      <div key={message.id} className="chat mb-6 chat-start">
                        <div className="chat-image avatar w-10  rounded-full border border-1 border-base-300 ">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-10">
                              <span className="text-xl capitalize">
                                {isDoctor
                                  ? currentChat.expand?.user.name[0]
                                  : currentChat.expand?.user.name[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="chat-header">
                          {isDoctor
                            ? currentChat.expand?.user.name
                            : currentChat.expand?.doctor.name}
                          <time className="text-xs opacity-50 mx-2">
                            {new Date(message.created)
                              .toLocaleTimeString()
                              .split(":")[0] +
                              ":" +
                              new Date(message.created)
                                .toLocaleTimeString()
                                .split(":")[1]}
                          </time>
                        </div>
                        {message?.isAttatchment ? (
                          <div class="card w-5/6   bg-base-100 shadow rounded border-base-200 border-1">
                            <div className="p-3">
                              <p>Attatchement</p>
                              <div className="divider mt-0 p-0"></div>
                              <p>{message.message}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="chat-bubble">{message.message}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-2 mt-12 flex flex-col mx-2">
                <p>
                  No messages yet, spark a conversation by typing a message
                  below.
                </p>
              </div>
            )}
          </div>
          <div className="absolute bottom-5 left-0 w-full ">
            <div className="  w-full p-3 bg-white justify-center flex xl:w-full left-0 xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto    ">
              <div className="relative flex jusitify-between  w-full   gap-5 hero    mx-auto  ">
                <input
                  type="text"
                  className="input    w-full input-sm flex input-bordered rounded-full   "
                  ref={message_input}
                  placeholder="Type a message"
                ></input>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 hover:text-blue-500 cursor-pointer"
                  onClick={() => {
                    !message_input.current.value
                      ? alert("message cannot be empty")
                      : sendMessage(
                          isDoctor
                            ? currentChat.expand?.user.id
                            : currentChat.expand?.doctor.id,
                          message_input.current.value,
                        );
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <Bottomnav />
    </div>
  );
}
