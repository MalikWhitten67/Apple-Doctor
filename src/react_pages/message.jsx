import { useEffect, useRef, useState } from "react";
import { api } from ".";
import Bottomnav from "../components/react/bottomnav";
api.autoCancellation(false)
export default function Message() {
    let [messages, setMessages] = useState([])
    let [isDoctor, setIsDoctor] = useState(api.authStore.model.isDoctor)
    let compose = useRef()
    let [search, setSearch] = useState("")
    let chat = useRef()
    let message_input = useRef()
    let [isIndex, setIsIndex] = useState(false)
    let [searched, setSearched] = useState(false)
    let [loading, setLoading] = useState(false)
    let [chats, setChats] = useState([])
    let [currentChat, setCurrentChat] = useState(null)
    useEffect(() => {
        function debounce(func, timeout = 300) {
            let timer;
            isIndex = true;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                    setIsIndex(false)
                }, timeout);
            };
        }
        if (!isIndex) {

            api.collection('users').getFirstListItem(
                search.includes('@') ? `email="${search}"` : `name~"${search}"`
            ).then((res) => {
                setSearched(res)
            })
                .catch((err) => {
                    setSearched(false)
                })
        }


    }, [search])

    useEffect(() => {
        setLoading(true)
        api.collection('chats').getList(1, 100, {
            filter: isDoctor ? `doctor="${api.authStore.model.id}"` : `user="${api.authStore.model.id}"`,
            sort: '-created',
            expand: 'user,doctor,messages'
        })
            .then((res) => {
                setChats(res.items)
                setLoading(false)
            })
    }, [])

    function createChat() {
        api.collection('chats').getFirstListItem(`doctor="${isDoctor ? api.authStore.model.id : searched.id}" && user="${isDoctor ? searched.id : api.authStore.model.id}"`).then((res) => {
            if (res) {
                compose.current.close()
                return;
            }
        })
        api.collection('chats').create({
            doctor: isDoctor ? api.authStore.model.id : searched.id,
            user: isDoctor ? searched.id : api.authStore.model.id,
        }).then((res) => {
            compose.current.close()
            setChats([...chats, res])
        })
    }

    function getChat(id) {
        api.collection('chats').getOne(id, {
            expand: 'user,doctor,messages'
        }).then((res) => {
            setCurrentChat(res)
          
            chat.current.showModal()
        })

        api.collection('messages').getList(1, 100, {
            filter:`chat="${id}"`,
            sort: 'created',
        }).then((res) => {
            setMessages(res.items)
        })

        api.collection('messages').subscribe('*', (res) => {
            

            if (res.action === 'create' && res.record.chat === id
            && res.record.sent_by !== api.authStore.model.id
            ) {
                setMessages((messages) => [...messages, res.record])
            }
        })
    }

    function sendMessage(userid, content) {
        let data = {
            doctor: isDoctor ? api.authStore.model.id : userid,
            user: isDoctor ? userid : api.authStore.model.id,
            message: content,
            sent_by: api.authStore.model.id,
            chat: currentChat.id
        }
        api.collection(
            `messages`
        ).create(data).then((res) => {
            message_input.current.value = ""
            compose.current.close()
            setMessages((messages) => [...messages, res])
        })


    }
    window.onbeforeunload = function () {
        api.collection('messages').unsubscribe('*')
    }
    return (<div className="p-2">
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">
                    Chat
                </a>

            </div>
            <div>

            </div>
            <div className="flex-none">
                <svg
                    onClick={() => compose.current.showModal()}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>

            </div>
        </div>

        <div className="flex flex-col gap-5 mx-2  mt-4">
            {
                chats.length > 0 && !loading ? chats.map((chat) => {
                    return (
                        <div
                            key={chat.id}
                            onClick={() => getChat(chat.id)}
                            className="flex flex-col  p-2">
                            <div className="flex hero">
                                <div className="avatar online placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                        <span className="text-xl">{isDoctor ? chat.expand?.user.name[0] : chat.expand?.doctor.name[0]}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col mx-2">
                                    <p className="">
                                        {isDoctor ? chat.expand?.user.name : chat.expand?.doctor.name}
                                    </p>
                                    <p className="text-sm opacity-50">
                                        {isDoctor ? chat.expand?.user.email : chat.expand?.doctor.email}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )
                }) :
                    chats.length < 1 && !loading ?
                        <div className="p-2 mt-8 flex flex-col mx-2">
                            <p> You have no messages, click  <span
                                onClick={() => compose.current.showModal()}
                                className="text-blue-500">here</span> to start a conversation
                                with {isDoctor ? "a patient" : "a doctor"}
                            </p>
                        </div>
                        : <span className="loading loading-spinner-large mx-auto mt-8"></span>
            }
        </div>


        <dialog
            ref={compose}
            className="modal">
            <div className=" bg-white p-5  w-full  h-screen rounded">
                <div className="flex flex-row hero justify-between">
                    <svg
                        onClick={() => compose.current.close()}
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <p className="mx-2 mt-">
                        Choose a {isDoctor ? "patient" : "doctor"} to chat with.
                    </p>
                    <div></div>
                </div>

                <label className="label mt-6">
                    <span className="label-text text-lg font-bold">
                        To
                    </span>
                </label>
                <input
                    className="input rounded-full  w-full input-bordered"
                    type="text"

                    placeholder="Search by Email Address or Name"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="p-2 w-full absolute bottom-5 left-0  mx-auto flex jsutify-center">
                    <button
                        {...searched.checked ? {
                            className: "btn btn-ghost border border-slate-200 shadow w-[80%] mx-auto justify-center"
                        } : {
                            className: "hidden"
                        }}
                        onClick={createChat}  >
                        {
                            searched ? `Send Message to ${searched.name}` : `Create Chat`
                        }
                    </button>
                </div>


                {
                    searched ?
                        <div className="flex  hero gap-2 mt-6">
                            <div className="avatar   placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                                    <span className="text-xl">{searched.name[0]}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold">{searched.name}</p>
                                <p className="text-sm">{searched.email}</p>
                            </div>
                            <div class="form-control absolute end-5">
                                <label class="cursor-pointer label  ">
                                    <input type="checkbox" class="checkbox "
                                        onChange={(e) => {
                                            setSearched({ ...searched, checked: e.target.checked })

                                        }}
                                    />
                                </label>
                            </div>
                        </div> : null
                }
            </div>

        </dialog>
        <dialog
            ref={chat}
            className="modal">
            <div className=" bg-white p-3 mb-6  w-full  h-screen rounded overflow-auto">
                <div className="flex flex-row hero justify-between fixed top-0 mb-12 h-12 bg-white z-[999]">
                    <svg
                        onClick={() =>  {
                            chat.current.close()
                            api.collection('messages').unsubscribe('*')
                        }}
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <p className="mx-2 mt-">
                        {
                            currentChat ? `${isDoctor ? currentChat.expand?.user.name : currentChat.expand?.doctor.name}` : null
                        }
                    </p>
                    <div></div>
                </div>

                <div className="flex flex-col  gap-2 mb-12 mt-12 p-2">
                    {currentChat && messages.length > 0 ? messages.map((message) => {
                       
                        return <div key={message.id}>
                            {
                                message.sent_by === api.authStore.model.id ?
                                <div className="chat chat-end mb-6">
                                <div className="chat-image avatar">
                                <div className="avatar  placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                        <span className="text-xl">{isDoctor ? currentChat.expand?.user.name[0] : currentChat.expand?.doctor.name[0]}</span>
                                    </div>
                                </div>
                                </div>
                                <div className="chat-header">
                                    You!
                                    <time className="text-xs opacity-50 mx-2">
                                        {new Date(message.created).toLocaleTimeString().split(':')[0] + ':' + new Date(message.created).toLocaleTimeString().split(':')[1]}

                                    </time>
                                </div>
                                <div className="chat-bubble">{
                                    message.message
                                
                                }</div>
                            </div>
                            :     <div 
                            key={message.id}
                            className="chat mb-6 chat-start">
                            <div className="chat-image avatar">
                            <div className="avatar  placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                    <span className="text-xl">{isDoctor ? currentChat.expand?.doctor.name[0] : currentChat.expand?.user.name[0]}</span>
                                </div>
                                </div>
                            </div>
                            <div className="chat-header">
                                {isDoctor ? currentChat.expand?.doctor.name : currentChat.expand?.user.name}
                                <time className="text-xs opacity-50 mx-2">
                                        {new Date(message.created).toLocaleTimeString().split(':')[0] + ':' + new Date(message.created).toLocaleTimeString().split(':')[1]}

                                    </time>
                            </div>
                            <div className="chat-bubble">{
                                message.message
                            }</div>
                             
                        </div>
                       
                            }
                         

                        </div>
                    }) :
                        <div className="p-2 mt-12 flex flex-col mx-2">
                            <p>
                                No messages yet, spark a conversation by typing a message below.
                            </p>
                        </div>
                    }
                </div>




                <div className=" fixed bottom-0 pb-2 left-0 bg-white w-full mt-32">
                    <div className="relative flex hero w-5/6 mx-auto justify-center  ">
                        <input type="text"
                            className="input mt-2  input-bordered rounded-full    w-full"
                            ref={message_input}
                            placeholder="Type a message"
                        ></input>
                        <button
                            onClick={() => !message_input.current.value ? alert('message cannot be empty') : sendMessage(isDoctor ? currentChat.expand?.user.id : currentChat.expand?.doctor.id, message_input.current.value)}
                            className="  absolute  bottom-2 mr-2 p-1 right-2  rounded text-blue-500 bg-white  mx-auto  top-4 justify-center"
                        >
                            Send
                        </button>


                    </div>
                </div>
            </div>

        </dialog>

        <Bottomnav />
    </div>)
}