<template>
  <div id="ne-panel" class="ne-panel">
    <!--主面板-->
    <svg id="ne-main-panel" class="ne-main-panel" :width="mainPanel.width" :height="mainPanel.height"
         :viewBox="formatScale(mainPanel.x) + ' ' + formatScale(mainPanel.y) + ' '
              + formatScale(mainPanel.width) + ' ' + formatScale(mainPanel.height)"
         @wheel.stop.prevent="onHandleScroll"
         @contextmenu.stop.prevent=""
         @mousedown.right.stop.prevent="onRightMouseDown"
         @mousemove="onMouseMove">
      <defs id="grid-defs" class="grid-defs">
        <pattern id="mn-grid" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
          <path d="M 0.5 0 L 0 0 0 0.5" :stroke-width="formatScale(mainPanel.scale.value >= 80 ? 1 : 0.5)"/>
        </pattern>
        <pattern id="xs-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect v-if="mainPanel.scale.value >= 8" width="5" height="5" fill="url(#mn-grid)"/>
          <path d="M 5 0 L 0 0 0 5" :stroke-width="formatScale(mainPanel.scale.value >= 8 ? 1 : 0.5)"/>
        </pattern>
        <pattern id="sm-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect v-if="mainPanel.scale.value >= 0.8" width="50" height="50" fill="url(#xs-grid)"/>
          <path d="M 50 0 L 0 0 0 50" :stroke-width="formatScale(mainPanel.scale.value >= 0.8 ? 1 : 0.5)"/>
        </pattern>
        <pattern id="md-grid" width="500" height="500" patternUnits="userSpaceOnUse">
          <rect v-if="mainPanel.scale.value >= 0.08" width="500" height="500" fill="url(#sm-grid)"/>
          <path d="M 500 0 L 0 0 0 500" :stroke-width="formatScale(mainPanel.scale.value >= 0.08 ? 1 : 0.5)"/>
        </pattern>
        <pattern id="lg-grid" width="5000" height="5000" patternUnits="userSpaceOnUse">
          <rect v-if="mainPanel.scale.value >= 0.008" width="5000" height="5000" fill="url(#md-grid)"/>
          <path d="M 5000 0 L 0 0 0 5000" :stroke-width="formatScale(mainPanel.scale.value >= 0.008 ? 1 : 0.5)"/>
        </pattern>
      </defs>
      <!--网格和坐标系-->
      <g id="grid-group" class="grid-group" @mousedown.left.stop="onLeftMouseDown">
        <rect :x="formatScale(mainPanel.x)" :y="formatScale(mainPanel.y)"
              :width="formatScale(mainPanel.width)" :height="formatScale(mainPanel.height)"
              :fill="'url(#' + formatGrid(mainPanel.scale.value) + ')'"/>
        <line x1="0" :y1="formatScale(mainPanel.y)" x2="0" :y2="formatScale(mainPanel.y + mainPanel.height)"
              :stroke-width="formatScale(1)" class="coordinate-axis"/>
        <line y1="0" :x1="formatScale(mainPanel.x)" y2="0" :x2="formatScale(mainPanel.x + mainPanel.width)"
              :stroke-width="formatScale(1)" class="coordinate-axis"/>
      </g>
      <!--节点-->
      <g id="node-group">
        <g v-for="item in nodes">
          <ne-text v-if="item.name === 'ne-text'" :x="item.x" :y="item.y" :value="item.value"
                   :scale="mainPanel.scale.value" :selected="item.selected"></ne-text>
        </g>
      </g>
      <!--工具组-->
      <g id="tool-group" class="tool-group">
        <rect id="selection-range" class="selection-range" v-if="selection.show"
              :stroke-width="formatScale(1.5)" :stroke-dasharray="formatScale(4) + ',' + formatScale(4)"
              :x="selection.range.x" :y="selection.range.y"
              :width="formatScale(selection.range.width)" :height="formatScale(selection.range.height)"></rect>
      </g>
    </svg>
    <div id="ne-panel-info" :class="{'ne-panel-info':true, 'show':panelInfo.show}">
      <p>缩放：{{Math.ceil(mainPanel.scale.value * 100)}}%</p>
      <p>坐标：({{panelInfo.mouse.realX.toFixed(1)}}, {{panelInfo.mouse.realY.toFixed(1)}})</p>
      <p>大小：{{formatScale(mainPanel.width).toFixed(0)}} * {{formatScale(mainPanel.height).toFixed(0)}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ne-panel',
    props: {
      nodeList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        mainPanel: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          scale: {
            value: 1,
            minValue: 0.02,
            maxValue: 20,
            speed: 0.1
          }
        },
        panelInfo: {
          show: false,
          delay: 1000,
          timer: null,
          mouse: {
            realX: 0,
            realY: 0
          }
        },
        selection: {
          show: false,
          range: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          }
        },
        nodes: this.nodeList
      }
    },
    methods: {
      /**
       * 鼠标移动响应方法，当鼠标在面板上移动时触发，显示鼠标当前的世界坐标
       */
      onMouseMove(event) {
        let that = this;
        that.panelInfo.mouse.realX = that.formatScale(that.mainPanel.x + event.offsetX);
        that.panelInfo.mouse.realY = that.formatScale(that.mainPanel.y + event.offsetY);
        // 显示鼠标坐标
        that.panelInfo.show = true;
        if(that.panelInfo.timer !== null) {
          clearTimeout(that.panelInfo.timer);
        }
        that.panelInfo.timer = setTimeout(function () {
          that.panelInfo.show = false;
        }, that.panelInfo.delay);
      },
      /**
       * 鼠标滚轮响应方法，对画布进行缩放
       */
      onHandleScroll(event) {
        let that = this;
        let scale = that.mainPanel.scale; // 原始缩放倍数
        if((scale.value === scale.minValue && event.deltaY > 0) || (scale.value === scale.maxValue && event.deltaY <= 0)) {
          return; // 如果已经到了最小比例却还继续缩小或已经到了最大比例却还继续放大，就不做操作
        }
        let scaleCache = scale.value * (event.deltaY > 0 ? 1 - scale.speed : 1 + scale.speed);
        scaleCache = Math.max(scale.minValue, Math.min(scale.maxValue, scaleCache));  // 目标缩放倍数
        let realX = that.formatScale(that.mainPanel.x + event.offsetX);
        let realY = that.formatScale(that.mainPanel.y + event.offsetY);
        that.mainPanel.x -= realX * scale.speed * scale.value * (event.deltaY > 0 ? 1 : -1);
        that.mainPanel.y -= realY * scale.speed * scale.value * (event.deltaY > 0 ? 1 : -1);
        scale.value = scaleCache;
        // 显示缩放倍数
        that.panelInfo.show = true;
        if(that.panelInfo.timer !== null) {
          clearTimeout(that.panelInfo.timer);
        }
        that.panelInfo.timer = setTimeout(function () {
          that.panelInfo.show = false;
        }, that.panelInfo.delay);
      },
      /**
       * 鼠标左键事件
       */
      onLeftMouseDown(event) {
        let that = this;
        let panel = document.getElementById('ne-panel');
        let realX = that.formatScale(that.mainPanel.x + event.offsetX);
        let realY = that.formatScale(that.mainPanel.y + event.offsetY);
        let xBefore = event.clientX;
        let yBefore = event.clientY;
        that.selection.show = true;
        panel.onmousemove = function(event) {
          let deltaX = event.clientX - xBefore;
          let deltaY = event.clientY - yBefore;
          that.selection.range.x = realX + Math.min(deltaX, 0);
          that.selection.range.y = realY + Math.min(deltaY, 0);
          that.selection.range.width = Math.abs(deltaX);
          that.selection.range.height = Math.abs(deltaY);
        };
        panel.onmouseleave = resetFunc;
        panel.onmouseup = resetFunc;
        function resetFunc() {
          panel.onmousemove = null;
          that.selection.show = false;
          that.selection.range.x = 0;
          that.selection.range.y = 0;
          that.selection.range.width = 0;
          that.selection.range.height = 0;
        }
      },
      /**
       * 鼠标右键事件
       */
      onRightMouseDown(event) {
        let that = this;
        let panel = document.getElementById('grid-group');
        panel.style.cursor = 'pointer';
        let xBefore = event.clientX;
        let yBefore = event.clientY;
        event.target.onmousemove = function(event) {
          that.mainPanel.x -= event.clientX - xBefore;
          that.mainPanel.y -= event.clientY - yBefore;
          xBefore = event.clientX;
          yBefore = event.clientY;
        };
        event.target.onmouseleave = resetFunc;
        event.target.onmouseup = function() {
          resetFunc();
          if (event.clientX === xBefore && event.clientY === yBefore) {
            console.log('click');
          }
        };
        function resetFunc() {
          panel.style.cursor = 'inherit';
          event.target.onmousemove = null;
        }
      },
      /**
       * 元素大小发生改变时触发
       */
      onResize() {
        let that = this;
        let container = document.getElementById("ne-panel");
        that.mainPanel.x -= (container.offsetWidth - that.mainPanel.width) / 2;
        that.mainPanel.y -= (container.offsetHeight - that.mainPanel.height) / 2;
        that.mainPanel.width = container.offsetWidth;
        that.mainPanel.height = container.offsetHeight;
        // 显示画布大小
        that.panelInfo.show = true;
        if(that.panelInfo.timer !== null) {
          clearTimeout(that.panelInfo.timer);
        }
        that.panelInfo.timer = setTimeout(function () {
          that.panelInfo.show = false;
        }, that.panelInfo.delay);
      },
      /**
       * 数值转换方法，在缩放坐标的同时保证保证线宽、尺寸等值不变
       */
      formatScale(number) {
        return number / this.mainPanel.scale.value;
      },
      /**
       * 根据传入的放大倍数返回合适尺寸的格子
       */
      formatGrid(number) {
        if (number >= 8) {
          return'xs-grid';
        } else if (number >= 0.8) {
          return 'sm-grid';
        } else if (number >= 0.08) {
          return 'md-grid';
        } else if (number >= 0.008) {
          return 'lg-grid';
        } else {
          return '';
        }
      }
    },
    mounted () {
      // 对画布尺寸进行初始化，绑定事件监听方法
      let container = document.getElementById("ne-panel");
      this.mainPanel.width = container.offsetWidth;
      this.mainPanel.height = container.offsetHeight;
      this.mainPanel.x = -container.offsetWidth / 2;
      this.mainPanel.y = -container.offsetHeight / 2;
      window.onresize = this.onResize;
    }
  }
</script>

<style lang="scss" scoped>
  @import './scss/base.scss';

  .ne-panel {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .ne-main-panel {
      width: 100%;
      height: 100%;

      .grid-defs {
        path {
          fill: none;
          stroke: $grid-stroke-color;
          stroke-opacity: 0.4;
        }
      }

      .grid-group {
        .coordinate-axis {
          stroke: $grid-stroke-color;
          stroke-opacity: 0.4;
        }
      }

      .tool-group {
        .selection-range {
          fill: none;
          stroke: $selection-box-color;
        }
      }
    }

    .ne-panel-info {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 10px;
      color: #fff;
      font-size: 12px;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: all .3s ease-in-out;
      &[class*=show] { opacity: 1; }
    }
  }
</style>
