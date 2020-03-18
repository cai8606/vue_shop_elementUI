import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Submenu,
Menu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn,
Pagination, Dialog, MessageBox, Checkbox, Divider, Tree, Switch, Tag}from 'element-ui'


//导入弹框提示组件message,需要挂载到Vue原型
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button) 
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Divider)
Vue.use(Tree)
Vue.use(Switch)
Vue.use(Tag)
