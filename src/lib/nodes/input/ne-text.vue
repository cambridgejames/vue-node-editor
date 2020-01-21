<template>
    <g ref="ne-text" class="ne-node ne-text" :transform="'translate(' + mainPanel.x + ',' + mainPanel.y + ')'">
      <rect ref="text-main-container" :class="{'main-container':true, 'text-main-container':true, 'selected':mainPanel.selected}"
            x="0" y="0" :width="mainPanel.width" :height="mainPanel.height"></rect>
      <g ref="text-title-group" class="title-group"
         @mousedown.left.stop="onLeftMouseDown">
        <rect ref="text-title-back" class="title-back" x="0" y="0" :width="mainPanel.width"></rect>
        <text ref="text-title-text" class="title-text" :x="mainPanel.width / 2" y="16">文字输入</text>
      </g>
      <g ref="text-output-group" class="output-group">
        <text ref="text-output-text" class="output-text" :x="mainPanel.width - 20" y="16"
              @mousedown.left.stop.prevent="">值</text>
        <circle ref="output-point" class="output-point" :cx="mainPanel.width - 10" cy="12" r="4"
                @mousedown.left.stop.prevent=""></circle>
      </g>
      <g ref="text-input-group" class="input-group text-input-group">
        <foreignObject ref="text-input-box" class="text-input-box" :width="mainPanel.width" height="24">
          <label>
            <input ref="text-input-control" class="text-input-control" type="text" placeholder="请输入文字"
                   v-model="input.value"
                   @input="onChangeValue"/>
          </label>
        </foreignObject>
      </g>
    </g>
</template>

<script>
  export default {
    name: 'ne-text',
    props: {
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      value: {
        type: String,
        required: false
      },
      scale: {
        type: Number,
        required: true
      },
      selected: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      value(newVal) { this.input.value = newVal; },
      scale(newVal) { this.mainPanel.scale = newVal; },
      selected(newVal) { this.mainPanel.selected = newVal; }
    },
    data() {
      return {
        mainPanel: {
          scale: this.scale,
          x: this.x,
          y: this.y,
          width: 150,
          height: 80,
          selected: this.selected
        },
        input: {
          value: this.value
        }
      }
    },
    methods: {
      onChangeValue() {
        let that = this;
        that.$emit('value', that.input.value);
      },
      onLeftMouseDown(event) {
        let that = this;
        let panel = that.$refs['ne-text'];
        that.$refs['text-title-group'].style.cursor = 'pointer';
        let xBefore = event.clientX;
        let yBefore = event.clientY;
        panel.onmousemove = function(event) {
          that.mainPanel.x += (event.clientX - xBefore) / that.mainPanel.scale;
          that.mainPanel.y += (event.clientY - yBefore) / that.mainPanel.scale;
          xBefore = event.clientX;
          yBefore = event.clientY;
        };
        document.onmouseup = function() {
          that.$refs['text-title-group'].style.cursor = 'inherit';
          panel.onmousemove = null;
        };
      },
      /**
       * 数值转换方法，在缩放坐标的同时保证保证线宽、尺寸等值不变
       */
      formatScale(number) {
        return number / this.mainPanel.scale;
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  @import '../../scss/base.scss';

  .ne-text {
    .text-main-container {
      fill: $input-node-background;
    }

    .text-input-group {
      .text-input-box {
        .text-input-control {
          width: 120px;
          height: 24px;
          margin-left: 15px;
          line-height: 24px;
          outline: none;
          border: none;
        }
      }
    }
  }

</style>
