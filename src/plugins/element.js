import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'


//导入弹框提示组件message,需要挂载到Vue原型
Vue.prototype.$message = Message

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
