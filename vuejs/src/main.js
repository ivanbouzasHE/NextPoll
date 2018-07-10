import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import com from "./services/com";
import VueLogger from "vuejs-logger";
import VueSweetalert2 from "vue-sweetalert2";
import BootstrapVue from "bootstrap-vue";
import Icon from "vue-awesome/components/Icon";
import draggable from "vuedraggable";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-awesome/icons";

const loggerOptions = {
  // required ['debug', 'info', 'warn', 'error', 'fatal']
  logLevel: "debug",
  // optional : defaults to false if not specified
  showConsoleColors: true
};

Vue.config.productionTip = false;

Vue.use(VueLogger, loggerOptions);
Vue.use(com);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.component("icon", Icon);
Vue.component("draggable", draggable);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
