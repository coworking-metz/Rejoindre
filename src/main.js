import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Base from "@/layouts/Base.vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.component("Base", Base);
app.use(router);
app.use(pinia);
app.mount("#app");
