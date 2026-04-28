import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Vue from 'vue'
import App from './App.vue'
import './assets/global.css'
import { pinia } from './stores/pinia'

window.Vue = Vue

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
