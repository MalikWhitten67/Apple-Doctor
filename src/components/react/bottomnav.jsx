import { api } from "../../react_pages";

export default function Bottomnav() {
  return (
    <div
      className="justify-center mx-auto fixed bottom-0 inset-x-0  z-[999] 
    w-full   p-2 mt-8 xl:w-[30vw] xl:mx-auto xl:justify-center lg:w-[30vw] lg:mx-auto lg:justify-center
    flex flex-col"
    >
      <ul className="menu flex justify-between font-bold menu-horizontal   w-full  ">
        <li className="bg-transparent focus:bg-transparent active:bg-transparent">
          <a
            href={api.authStore.model.isDoctor ? "/dash_doctor" : "/dash_user"}
            className={
              window.location.pathname.includes("dash_doctor") ||
              window.location.pathname.includes("dash_user")
                ? "bg-blue-500  focus:bg-transprent rounded-full text-white "
                : `focus:bg-transparent active:bg-transparent hover:bg-transparent rounded-full `
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>

            {window.location.pathname.includes("dash_doctor") ||
            window.location.pathname.includes("dash_user")
              ? "Home"
              : null}
          </a>
        </li>
        <li>
          <a
            href="/assessments"
            className={
              window.location.pathname.includes("assessments")
                ? "bg-blue-500  rounded-full text-white "
                : ``
            }
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
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
            {window.location.pathname.includes("assessments")
              ? "Assessments"
              : null}
          </a>
        </li>
        <li>
          <a
            href="/message"
            className={
              window.location.pathname.includes("message")
                ? "bg-blue-500  rounded-full text-white "
                : ``
            }
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>

            {window.location.pathname.includes("message") ? "Messages" : null}
          </a>
        </li>
      </ul>
    </div>
  );
}
