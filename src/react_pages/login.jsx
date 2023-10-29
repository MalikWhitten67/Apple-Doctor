
import { Image } from 'astro:assets';
import { useState, useEffect, useRef } from 'react';
import { api } from '.';
 
 
export default function Login(){
  let button = useRef();
 let [btnstate, setBtnstate] = useState("aborted");
 let [isLogin, setIsLogin] = useState(false);
 let [isDoctor, setIsDoctor] = useState(false);
 let [loginData, setLoginData] = useState({email: "", password: ""});
  function login(e) {
    setBtnstate("loading");
    const authData =  api.collection(
        isDoctor ? 'doctors' : 'users'
    ).authWithPassword(
        loginData.email,
        loginData.password
    );
    authData.then((res) => {
           isDoctor ? window.location.href = '/dash_doctor' : window.location.href = '/dash_user'
    })
    setTimeout(() => {
        setBtnstate("aborted");
    }, 1000);
  }
  useEffect(() => {
    api.authStore.isValid ? window.location.href = '/dash_user' : null
     
  }, [])
 return (
     <div>
 

  
    <div className="hero  w-screen  mt-24 justify-center flex flex-col gap-5 mx-auto">
        <div className=" mb-8 ">
            <h1 className={` text-3xl 
            ${
                document.documentElement.getAttribute('data-theme') === 'black'
                ? 'text-white'
                : 'text-black'
            }
            font-bold  mx-auto  w-5/6 justify-center`}>
                <span className='text-blue-500'>Apple Doc</span> - Your Health, Your Way!
            </h1>
        </div>
         <div className="flex flex-col gap-5 mx-auto  w-5/6 justify-center">
        <input 
        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
        className="input rounded-full input-bordered    " type="text" placeholder="Email" />
        <input 
        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
        className="input rounded-full input-bordered " type="password" placeholder="Password" />
        <button className={`btn btn-ghost   ${
         document.documentElement.getAttribute('data-theme') === 'black'
              ? 'bg-white text-black hover:bg-white focus:border '
              : 'bg-black hover:bg-black text-white  focus:border-4 focus:border-blue-500'
            } capitalize   rounded-full font-bold`}
            onClick={login}
            >
            Login {isDoctor ? 'As a Doctor' : null}
            
            {
                btnstate === "loading" ? (
                   <div className='loading loading-sm loading-dots
                   '></div>
                ) : null
            }
        </button>
        <a href='/register' className="link text-md">Don't have an account? Register</a>
        </div>
        
        <div className="divider  before:rounded after:rounded text-sm mt-2 h-0  w-5/6 justify-center  mx-auto flex">Or</div>
   
        <button
        onClick={()=> {
            isDoctor ? setIsDoctor(false) : setIsDoctor(true)
        }}
        className={`btn btn-ghost w-5/6 ${
       document.documentElement.getAttribute('data-theme') === 'black'
           ? 'bg-white text-black hover:bg-white focus:border '
           : 'bg-black hover:bg-black text-white  focus:border-4 focus:border-blue-500'
   } capitalize   rounded-full font-bold`}>
            Login as  {isDoctor ? 'Patient' : 'Doctor'}
        </button>
        <p className="text-start text-sm   mx-auto w-5/6 ">
            By continuing, you agree to our <a className="link" href='/tos'>Terms of Service</a> and  <a href='/privacy' className="link">Privacy Policy</a>
        </p>
    </div>
    
 
     </div>
 )
}
