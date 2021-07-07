let ipcRenderer;
if (process.env.NODE_ENV != "development") {
    ipcRenderer = require("electron").ipcRenderer;
}

const CountClick = {
    bind(el, binding, vnode) {
        const maxCount = MAP_CONFIG.SAVE_MAP_FILE_CLICK_COUNT || 10;
        const interval = 500;
        let count = 0;
        let lastTime = 0;
        let canClick = true;

        // 收到主进程文件保存完毕的回调之后才可以重新点击
        ipcRenderer && ipcRenderer.on('exportFileEnd', () => {
            canClick = true;
        })

        el.onclick = () => {
            if (!canClick) false;
            const date = new Date()
            if (date.getTime() - lastTime > interval) {
                lastTime = 0;
            }
            if (count === 0) {
                count++;
                lastTime = date.getTime();
                return
            }
            const currentInterval = date.getTime() - lastTime;
            if (currentInterval < interval) {
                if (count > maxCount - 2) {
                    // 此时不允许点击
                    canClick = false;
                    count = 0;
                    lastTime = 0;
                    vnode.context.$EventBus?.$emit("exportSaveFile");
                    return
                }

                count++;
                lastTime = date.getTime();
                return
            }
            count = 0;
        }
    }
}

export default CountClick;