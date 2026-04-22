import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { marked } from 'marked';

const app = createApp(App);
app.use(router);
// 全局注册marked
app.config.globalProperties.$marked = marked;
app.mount('#app');

// 当路由准备就绪时触发自定义事件并处理路由恢复
router.isReady().then(() => {
  // 检查是否有需要恢复的路径
  const redirectPath = sessionStorage.getItem('redirect-path');
  if (redirectPath) {
    sessionStorage.removeItem('redirect-path');
    // 移除 base 前缀，获取相对路径
    const base = '/ml-course/';
    const relativePath = redirectPath.startsWith(base) 
      ? redirectPath.substring(base.length)
      : redirectPath.replace(/^\//, '');
    // 使用 router.push 跳转
    router.push('/' + relativePath);
  }
  
  window.__vue_router_ready__ = true;
  window.dispatchEvent(new Event('vue-router-ready'));
});
