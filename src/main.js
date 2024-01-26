import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.config.productionTip = false;
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
