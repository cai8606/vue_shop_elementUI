import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//将axios提交数据时的默认json格式改为表单格式提交
import qs from 'qs'
import axios from 'axios'
//导入vue自定义指令
//import './assets/js/btnPermissions'

Vue.prototype.$http = axios
Vue.prototype.$qs = qs

axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(config => {
  //console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})

const that = this;
axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  // 数据不正常情况下返回（比如：token过期，参数不足）
    console.log("======= interceptors response =======");
    console.log(res);
    if(undefined==res){
    	
    }
    if(res.data.statusCode==2001){
    	router.replace({
        path: 'login',
    	})
    }
    if(res.data.statusCode==403){
      // router.replace({
      //   path: 'noPerms',
      // })
      router.push('/noPerms')
    }
    return Promise.resolve(res);
 
}, function (error) {
  // 对响应错误做点什么
//this.$router.push({path:'/login'});
return Promise.resolve(res);
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
