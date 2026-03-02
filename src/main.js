import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { marked } from 'marked'

const app = createApp(App)
app.use(router)
// 全局注册marked
app.config.globalProperties.$marked = marked
app.mount('#app')
