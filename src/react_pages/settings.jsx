import { useState } from "react";
import Nav from "../components/react/nav";
import { api } from "./index";

export default function Index() {
  let [profile, setProfile] = useState(api.authStore.model);
  let [edit, setEdit] = useState(null);
  let [hasChanged, setHasChanged] = useState(false);
  let [edited, setEdited] = useState({});
  function saveChanges() {
    let form = new FormData();
    if (edited.name) {
      form.append("name", edited.name);
    } else if (edited.email) {
      form.append("name", edited.email);
    } else if (edited.avatar) {
      form.append("name", edited.avatar);
      setHasChanged(false);
    } else {
      return;
    }
    api
      .collection(profile.isDoctor ? "doctors" : "users")
      .update(profile.id, form)
      .then((d) => {
        api.collection(profile.isDoctor ? "doctors" : "users").authRefresh();
        setEdit(null);
        setHasChanged(false);
      });
  }
  return (
    <div className=" p-2 font-sans mt-8 xl:w-[30vw] xl:mt-24 xl:justify-center xl:mx-auto lg:w-[30vw] lg:justify-center lg:mx-auto">
      <div className="card card-compact  border border-slate-200 bg-base-100 shadow-xl">
        <figure className="flex justify-center mx-auto ">
          <div className=" mt-8 flex flex-col">
            <div
              className={`card card-compact bg-base-100 text-sm 
            ${
              document.querySelector("html").getAttribute("data-theme") ===
              "black"
                ? " bg-base-100"
                : "bg-white"
            }
            
            rounded   `}
            >
              <div className="card-body">
                <div className="indicator  ">
                  <span
                    className={`indicator-item
                    bg-base-300
                    rounded-full p-1 mt-2 mr-2
              hover:text-sky-500 hover:cursor-pointer flex justify-start
              `}
                  >
                    <label htmlFor="avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3   h-3 cursor-pointer"
                      >
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                      </svg>
                    </label>
                  </span>

                  {api.authStore.model.avatar || edited.avatar ? (
                    <img
                      src={
                        edited.avatar
                          ? URL.createObjectURL(edited.avatar)
                          : profile.avatar && profile.isDoctor != true
                          ? `${api.baseUrl}/api/files/_pb_users_auth_/${profile.id}/${profile.avatar}`
                          : `${api.baseUrl}/api/files/t0bw8kyqy50fzxa/${profile.id}/${profile.avatar}`
                      }
                      className="w-16 h-16 rounded-full border border-1 border-base-300 avatar"
                    />
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content  border-slate-200 rounded-full w-16">
                        <span className="text-xl capitalize">
                          {api.authStore.model.name[0]}
                        </span>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    id="avatar"
                    className="hidden"
                    onChange={(e) => {
                      setEdited({ ...edited, avatar: e.target.files[0] });
                      setHasChanged(true);
                      e.target.value = null;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </figure>
        <div className="card-body">
          <div className="flex flex-col w-full relative">
            <label>Full Name</label>
            <div className="relative">
              <input
                type="text"
                {...(edit == "username"
                  ? { disabled: false }
                  : { disabled: true })}
                className="mt-2 input input-bordered w-full  "
                placeholder={api.authStore.model.name}
                onChange={(e) => {
                  if (e.target.value != edited.name) {
                    setHasChanged(true);
                  } else if (e.target.value == "") {
                    setHasChanged(false);
                  }
                  setEdited({ ...edited, name: e.target.value });
                }}
              />
              {edit != "username" ? (
                <div
                  className="absolute end-5 top-5 text-blue-500 cursor-pointer "
                  onClick={() => {
                    setEdit("username");
                  }}
                >
                  Edit
                </div>
              ) : (
                ""
              )}
            </div>
            <label className="mt-2">Email</label>
            <div className="relative">
              <input
                type="text"
                {...(edit == "email"
                  ? { disabled: false }
                  : { disabled: true })}
                className="mt-2 input input-bordered w-full "
                placeholder={api.authStore.model.email}
                onChange={(e) => {
                  if (e.target.value != edited.name) {
                    setHasChanged(true);
                  } else if (e.target.value == "") {
                    setHasChanged(false);
                  }
                  setEdited({ ...edited, email: e.target.value });
                }}
              />
              {edit != "email" ? (
                <div
                  className="absolute end-5 top-5 text-blue-500 cursor-pointer "
                  onClick={() => {
                    setEdit("email");
                  }}
                >
                  Edit
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="">
            {hasChanged ? (
              <button
                onClick={() => {
                  saveChanges();
                }}
                className="btn bg-blue-500 mb-2 mt-2 hover:bg-error hover:shadow text-white w-full btn-circle rounded-box"
              >
                Save Changes
              </button>
            ) : (
              ""
            )}
            <button
              onClick={() => {
                api.authStore.clear();
                window.location.href = "/";
              }}
              className="btn bg-error hover:bg-error hover:shadow text-white w-full btn-circle rounded-box"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
