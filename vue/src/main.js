import Vue from 'vue';
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import App from './components/App.vue';

import api from './api';
Vue.use(api);

import utils from './utils';
Vue.use(utils);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
