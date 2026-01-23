import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@arco-design/web-vue/dist/arco.css' // Ensure global styles and dynamic component styles (Message/Modal) are present

// 手动引入 Message 组件及其样式
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/es/message/style/css.js'

import App from './App.vue'
import router from './router'
import './assets/base.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// 全局注册 Message (可选，但既然手动引入了组件，最好注册一下)
Message._context = app._context;

app.mount('#app')
