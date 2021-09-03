import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCollapsiblePanel from '@dafcoe/vue-collapsible-panel';

const app = createApp(App);
app.config.globalProperties.SENSOR_API_URL = "http://135.181.150.18:888/";
app.use(store).use(router).use(VueCollapsiblePanel).use(VueAxios, axios);
app.mount("#app");
