import Loading from "./loading";
import Vue from "vue";

const LoadingConstructor = Vue.extend(Loading);

let _loading = null;

const LoadingPlugins = (options) => {
  function initLoading() {
   
    if (!_loading) {
      _loading = new LoadingConstructor();
      _loading.$mount();
      // 渲染DOM

      document.querySelector("body").appendChild(_loading.$el);
    }
  }

  function showLoading() {
    initLoading();
    _loading.show(options);

    return _loading;
  }

  return showLoading();
};



export default LoadingPlugins;
