import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const vuetify = createVuetify({
    components,
    directives,
})


const app = createApp(App)
const pinia = createPinia()


pinia.use(piniaPluginPersistedstate)
app.use(vuetify)
app.use(router)
app.use(pinia)

app.mount('#app')