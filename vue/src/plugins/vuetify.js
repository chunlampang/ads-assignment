import Vue from 'vue';
import Vuetify, { VLayout } from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify, {
  components: {
    VLayout
  },
  iconfont: 'md',
  theme: {
    primary: "#b01861"
  },
})