import Vue from 'vue';
import './plugins';
import App from './components/App.vue';
import router from './router';

import api from './api';
Vue.use(api);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
