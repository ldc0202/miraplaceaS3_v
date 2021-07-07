<template>
  <div class="svgBtn">
    <img src="../../assets/images/screenProtect/enter.png" alt="" class="centeimg">
    <svg class="s1" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path id="path1" d=""  fill="green" fill-opacity="0" stroke-width="8px"/>
    </svg>
    <svg class="s2" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path id="path2" d=""  fill="green" fill-opacity="0" stroke-width="8px"/>
    </svg>
    <svg class="s3" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path id="path3" d=""  fill="green" fill-opacity="0" stroke-width="8px"/>
    </svg>
    <svg class="s4" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path id="path4" d=""  fill="green" fill-opacity="0" stroke-width="8px"/>
    </svg>
  </div>
</template>

<script>
export default {
  props:{
    maxRadius:Number,//最大半径
    showNum:Number,//圆弧显示个数
  },
  components: {},
  data() {
    return {
      perimeter:Math.PI * 8  * 32,
    };
  },
  computed: {},
  watch: {},
  methods: {
    /**
    * 角度转化成弧度
    * @param {Number} deg - 角度
    * @return {Float} 弧度
    */
    /*  var arc = function(deg) {
        return deg * 2 * Math.PI / 360;
    } */
    /**
    * path路径属性的一些注释
    * @attribute d 路径操作
    * 
    * @function M 用来移动到指定的点，注意这个不会留下路径痕迹
    * @arg x 横坐标
    * @arg y 纵坐标
    * @example  
    *    M100 100  代表移动到 坐标x = 100, y = 100的点
    *   <path d="M100 100" fill="transparent" stroke-width="1" stroke-linecap="round" stroke="red"/>
    * 
    * @function L 用来画线，画之前需要先用M指定起始点
    * @arg x 横坐标
    * @arg y 纵坐标
    * @example 
    *   M0 0 L100 100 代表画一条线，线的终点是 x = 100, y = 100的点
    * <?xml version="1.0" standalone="no"?>
    * <svg width="200px" height="200px" version="1.1" xmlns="http://www.w3.org/2000/svg">
    *    <path d="M0 0 L10 10 L80 100 L20 60" stroke-width="3" stroke-linecap="round" stroke="red"fill="yellow"/>
    * </svg>
    * 
    * @function A 弧形
    * @arg rx x轴半径
    * @arg ry y轴半径
    * @arg x-axis-rotation x轴旋转角度，椭圆的时候就有效果了
    * @arg large-arc-flag 决定弧线是大于还是小于180度
    * @arg sweep-flag 表示弧线的方向 0表示从起点到终点沿逆时针画弧 1表示顺时针
    * @arg x 结束点横坐标
    * @arg y 结束点纵坐标
    * @example
    * 以下是起点坐标(74.12, 196.60)，终点坐标是(125.88 196.59)，的大圆弧，半径是100
    * <?xml version="1.0" standalone="no"?>
    * <svg width="200px" height="200px" version="1.1" xmlns="http://www.w3.org/2000/svg" style="border: solid 1px black">
    *    <path d="M74.12 196.60 A100 100, 1, 1, 1, 125.88 196.59" fill="transparent" stroke-width="3" stroke-linecap="round" stroke="red"/>
    * </svg>
    */
    delayShowReturn(){
      this.run('path1', 90, 1,180,452,270);
     // this.run('path2', 180, 0,50);
      this.run('path3', 180, 0,220,490,270);
      //this.run('path4', 240, 1,100);
    },
    getSchedule(percent){
      return (1/percent)*this.perimeter;
    },

  changeArcDeg(path, d){
    path.setAttribute("d", d);
  },
  drawArcByRadiusDeg(startX, startY, r, deg, clockwise) {
    var cw = typeof clockwise !== 'undefined' ? clockwise : 1;
    var x = startX - r + r*Math.cos(deg*Math.PI/180);
    var y = startY + (1===cw ? 1 : -1)*r*Math.sin(deg*Math.PI/180);
    var bigOrSmall = 1;//deg > 180 ? 1 : 0;
    var line = " L" + (startX - r) + " " + startY + " L"+startX + " " + startY + "Z";
    return "M " + startX +" "+ startY + " A "+ r +" " + r + " 0 " + bigOrSmall + " " +cw+ " " + x + " " + y;
  },
  run(pid, deg, clockwise,radius,xpos,ypos){
    var path = document.getElementById(pid);
    var x = xpos, y = ypos, r = radius, add = 0===deg ? true : false;
    var that = this;
   
    path.setAttribute("d",this.drawArcByRadiusDeg(x,y,r,270,clockwise));
  }
  },
  created() {

  },
  mounted() {
    setTimeout(this.delayShowReturn,100)    
  },
  beforeDestroy() {}, //生命周期 - 销毁之前
};
</script>
<style lang="less" scoped>

  @keyframes rotate360 {
    100% {
      transform: rotate(-360deg);
    }
  }

  @keyframes rotate360wise {
    100% {
     transform: rotate(360deg);
    }
  }

  .svgBtn{
    width: 540px;
    height: 540px;
    border-radius: 50%;
    //background:rgba(0, 0, 0, 0.8);
    position:relative;

    .centeimg{
      padding-left: 123px;
      padding-top: 123px;;
    }
   
    .s1{
      left: 0px;
      top: 0px;
      position: absolute;
      width:540px; 
      height:540px; 

      #path1{
        stroke:#C3A46E;
      }
      animation: rotate360 2s linear 0.2s infinite;
    }

    .s2{
      left: 0px;
      top: 0px;
      position: absolute;
      width:540px; 
      height:540px; 

      #path2{
        stroke:rgba(255, 255, 255, 0.5);
      }
    //background: #F2F2F2;
    }

    .s3{
      left: 0;
      top: 0px;
      position: absolute;
      width:540px; 
      height:540px; 

      #path3{
         stroke:rgba(255, 255, 255, 0.8);
         //linear-gradient(180deg, #FFFFFF 0%, #C3A46E 100%);
      }
      animation: rotate360wise 2s linear 0.2s infinite;
    }

    .s4{
      left: 0px;
      top: 0px;
      position: absolute;
      width:540px; 
      height:540px; 

      #path4{
         stroke:rgba(255, 255, 255, 0.5);
      }
    }
  } 

//@import url(); 引入公共css类
</style>
