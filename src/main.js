import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

const moment = require('moment-timezone')
require('moment/locale/ru')
moment.locale('ru')
moment.tz.setDefault('UTC')

Vue.config.productionTip = false

Vue.use(require('vue-moment'), {
  moment
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
