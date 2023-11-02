import Pocketbase from "pocketbase";
export const api = new Pocketbase("https://apple-doctor.pockethost.io/");

export default function Index() {
  if (api.authStore.isValid) {
    window.location.href = "/dash_user";
  } else {
    window.location.href = "/login";
  }
}
