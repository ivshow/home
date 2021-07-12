import Vue from 'vue';
import App from './App';
import router from './router';
import '@/style/common.less';
import LuckDraw from 'vue-luck-draw';

Vue.use(LuckDraw);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
