import ScreenProtect from './screenProtect';
import Loading  from './loading';

const install = function (Vue) {
    Vue.prototype.$screenProtect = ScreenProtect;
    Vue.prototype.$loading = Loading;//挂载loading到vue
};

export default install;