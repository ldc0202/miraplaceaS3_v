const handleDrag = {
    bind(el) {
        // PC端
        el.onmousedown = e => {
            //算出鼠标相对元素的位置
            const disX = e.clientX - el.offsetLeft;
            const disY = e.clientY - el.offsetTop;
            document.onmousemove = e => {
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                const left = e.clientX - disX;
                const top = e.clientY - disY;

                //移动当前元素
                el.style.left = left + 'px';
                el.style.top = top + 'px';
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
        // 兼容移动端
        el.ontouchstart = e => {
            //算出鼠标相对元素的位置
            const clientX = e.pageX || e.touches[0].pageX;
            const clientY = e.pageY || e.touches[0].pageY;
            const disX = clientX - el.offsetLeft;
            const disY = clientY - el.offsetTop;

            document.ontouchmove = e => {
                const clientX = e.pageX || e.touches[0].pageX;
                const clientY = e.pageY || e.touches[0].pageY;
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                const left = clientX - disX;
                const top = clientY - disY;

                //移动当前元素
                el.style.left = left + 'px';
                el.style.top = top + 'px';
            };
            document.ontouchend = () => {
                document.ontouchmove = null;
                document.ontouchend = null;
            };
        }
    }
}

export default handleDrag;