import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Vue from 'vue'
import App from './App.vue'
import './assets/global.css'

window.Vue = Vue

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')
