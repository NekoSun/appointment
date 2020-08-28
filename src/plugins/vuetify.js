import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ru from 'vuetify/lib/locale/ru'
import '@mdi/font/css/materialdesignicons.css'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'tiptap-vuetify/dist/main.css'


Vue.use(Vuetify)

const vuetify = new Vuetify({
  lang: {
    locales: { ru },
    current: 'ru'
  },
  icons: {
    iconfont: 'md'
  }
})

Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'md'
})

export default vuetify
