import Vue from 'vue';
import vuetify from './plugins/vuetify';
import router from './plugins/router';
import App from './components/App.vue';

import api from './api';
Vue.use(api);

import utils from './utils';
Vue.use(utils);

import ListView from './components/maint/ListView';
Vue.component('ListView', ListView);
import EditView from './components/maint/EditView';
Vue.component('EditView', EditView);
import EditFields from './components/maint/EditFields';
Vue.component('EditFields', EditFields);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
