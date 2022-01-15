import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
app.use(store);
app.use(Toast, {});

app.mount("#app");
