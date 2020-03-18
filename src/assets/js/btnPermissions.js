import Vue from 'vue'

/**权限指令**/
Vue.directive('has', {
  inserted: function (el, binding) {
    //console.log(binding);
    if (!Vue.prototype.$_has(binding.value.perms)) {
      //console.log(el.parentNode);
      el.parentNode.removeChild(el);
    }
  }
});
//权限检查方法
Vue.prototype.$_has = function (value) {
  //    debugger

  let isExist = false;
  let buttonpermsStr = localStorage.getItem('permissionList');
  //console.log(value)
  //console.log(buttonpermsStr);
  if (buttonpermsStr == undefined || buttonpermsStr == null) {
    return false;
  }

  if(buttonpermsStr.indexOf(value) > -1){
    //console.log(value);
    isExist = true;
  }
  return isExist;
  
};
