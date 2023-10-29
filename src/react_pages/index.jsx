
import Pocketbase from 'pocketbase'
export const api = new Pocketbase('https://apple-doctor.pockethost.io/')
export default function Index() {
    return (
        <div>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">Apple Doc</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><a>Link</a></li>
                        <li>
                            <details>
                                <summary>
                                    Auth
                                </summary>
                                <ul className="p-2 bg-base-100">
                                    <li><a>Login</a></li>
                                    <li><a>Register</a></li>
                                    <li><a>Doctor Portal</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}