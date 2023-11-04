import { Image } from "astro:assets";
import { useState, useEffect, useRef } from "react";
import { api } from ".";

export default function Register() {
  let button = useRef();
  let [btnstate, setBtnstate] = useState("aborted");
  let [isregister, setIsregister] = useState(false);
  let [isDoctor, setIsDoctor] = useState(false);
  let [error, setError] = useState(null);
  let [registerData, setregisterData] = useState({ email: "", password: "" });
  function register(e) {
    setBtnstate("loading");
    if (registerData.password !== registerData.passwordConfirm) {
      setError({ message: `Passwords don't match` });
      setBtnstate("aborted");
      return;
    } else if (registerData.password.length < 6) {
      setError({ message: `Password must be at least 6 characters` });
      setBtnstate("aborted");
      return;
    }
    const authData = api.collection(isDoctor ? "doctors" : "users").create({
      email: registerData.email,
      password: registerData.password,
      passwordConfirm: registerData.passwordConfirm,
      name: registerData.name,
      isDoctor: isDoctor,
      emailVisibility: true,
    });
    authData.then((res) => {
      window.location.href = "/login";
    });
    authData.catch((err) => {
      let data = err.data.data;
      console.log(data);
      if (!data) return;

      if (
        err.data.code == 400 &&
        data.email &&
        data.email.code === "validation_invalid_email"
      ) {
        setError({
          message:
            data.email.message == "The email is invalid or in use."
              ? "Email is already in use!"
              : "Invalid Email",
        });
        document.querySelector('input[type="email"]').focus();
      } else if (
        err.data.code == 400 &&
        data.passwordConfirm &&
        data.passwordConfirm.code === "validation_required"
      ) {
        setError({ message: `Password Confirm is required` });
      } else if (
        err.data.code == 400 &&
        data.email &&
        data.email.code === "validation_is_email"
      ) {
        setError({ message: `Email is Invalid` });
      }
    });
    setTimeout(() => {
      setBtnstate("aborted");
    }, 1000);
  }

  return (
    <div>
      {error ? (
        <div
          onClick={() => setError(null)}
          className="alert hero flex justfify-center mx-auto mt-4  border border-1 border-slate-200 bg-transparent  w-5/6 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6  text-error h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>

          <label>{error.message}</label>
        </div>
      ) : null}

      <div className="hero  w-screen  xl:w-[30vw] mt-24 justify-center flex flex-col gap-5 mx-auto">
        <div className=" mb-8 ">
          <h1
            className={` text-2xl 
            ${
              document.documentElement.getAttribute("data-theme") === "black"
                ? "text-white"
                : "text-black"
            }
            font-bold  mx-auto  w-[85vw] justify-center`}
          >
            Join <span className="text-blue-500">Apple Doc</span> - To enhance
            your {isDoctor ? `patient's` : ``} experience!
          </h1>
        </div>
        <div className="flex flex-col gap-5 mx-auto  w-5/6 justify-center">
          <input
            onChange={(e) =>
              setregisterData({ ...registerData, name: e.target.value })
            }
            className="input rounded-full input-bordered"
            type="text"
            placeholder="Full Name: John Doe"
          />
          <input
            onChange={(e) =>
              setregisterData({ ...registerData, email: e.target.value })
            }
            className="input rounded-full input-bordered    "
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) =>
              setregisterData({ ...registerData, password: e.target.value })
            }
            className="input rounded-full input-bordered "
            type="password"
            placeholder="Password"
          />
          <input
            onChange={(e) =>
              setregisterData({
                ...registerData,
                passwordConfirm: e.target.value,
              })
            }
            className="input rounded-full input-bordered"
            type="password"
            placeholder="Confirm Password"
          />
          <button
            className={`btn btn-ghost   ${
              document.documentElement.getAttribute("data-theme") === "black"
                ? "bg-white text-black hover:bg-white focus:border "
                : "bg-black hover:bg-black text-white  focus:border-4 focus:border-blue-500"
            } capitalize   rounded-full font-bold`}
            onClick={register}
          >
            Register {isDoctor ? "As a Doctor" : null}
            {btnstate === "loading" ? (
              <div
                className="loading loading-sm loading-dots
                   "
              ></div>
            ) : null}
          </button>
          <a href="/login" className="link text-md">
            Already have an account? Login
          </a>
        </div>

        <div className="divider  before:rounded after:rounded text-sm mt-2 h-0  w-5/6 justify-center  mx-auto flex">
          Or
        </div>

        <button
          onClick={() => (isDoctor ? setIsDoctor(false) : setIsDoctor(true))}
          className={`btn btn-ghost w-5/6 ${
            document.documentElement.getAttribute("data-theme") === "black"
              ? "bg-white text-black hover:bg-white focus:border "
              : "bg-black hover:bg-black text-white  focus:border-4 focus:border-blue-500"
          } capitalize   rounded-full font-bold`}
        >
          Register As a {!isDoctor ? "Doctor" : "Patient"}
        </button>
        <p className="text-start text-sm   mx-auto w-5/6 ">
          By continuing, you agree to our{" "}
          <a className="link" href="/tos">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="link">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
