import Vue from 'vue';
import './plugins';
import App from './components/App.vue';
import router from './router';

import api from './api';
Vue.use(api);

import utils from './utils';
Vue.use(utils);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
