import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
import VueDragDrop from "vue-drag-drop";
import htmltag from "./components/htmltag";
import sauce from "vue-sauce";

Vue.use(VueDragDrop);
Vue.use(Vuetify);
Vue.directive("sauce", sauce);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  componens: { htmltag }
}).$mount("#app");
