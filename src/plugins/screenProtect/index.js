import Main from './src/screenProtector.vue';
import Vue from 'vue';
const ScreenProtectorConstructor = Vue.extend(Main);

const ScreenProtector = (options) => {
    function initScreenProtector() {
        const _screenProtector = new ScreenProtectorConstructor();
        _screenProtector.$mount();
        // 渲染屏保DOM
        document.querySelector('body').appendChild(_screenProtector.$el);
        return Promise.resolve(_screenProtector);
    }

    async function showScreenProtector() {
        const _screenProtector = await initScreenProtector();
        if (typeof options === 'number') {
            _screenProtector.screenProtectTime = options;
        }
        // 初始化屏保事件
        _screenProtector.initScreenProtector()
        return _screenProtector;
    }

    return showScreenProtector()
}

export default ScreenProtector;