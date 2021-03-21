<template>
    <g ref="ne-output" class="ne-node ne-output" :transform="'translate(' + mainPanel.x + ',' + mainPanel.y + ')'">
        <rect ref="output-main-container"
              :class="{'main-container':true, 'output-main-container':true, 'selected':mainPanel.selected}"
              x="0" y="0" :width="mainPanel.width" :height="mainPanel.height"></rect>
        <g ref="output-title-group" class="title-group"
           @mousedown.left.stop="onLeftMouseDown">
            <rect ref="output-title-back" class="title-back" x="0" y="0" :width="mainPanel.width"></rect>
            <text ref="output-title-text" class="title-text" :x="mainPanel.width / 2" y="16">输出</text>
        </g>
        <g ref="output-input-group" class="input-group output-input-group">
            <text ref="output-input-text" class="input-text" x="20" y="16">{{ mainPanel.value }}</text>
            <circle ref="input-point" class="input-point" cx="10" cy="12" r="4" n-id="i0"
                    @mousedown.left.stop.prevent="onConnectionStart('i0')"
                    @mouseup.left.stop.prevent="onConnectionEnd('i0')"></circle>
        </g>
    </g>
</template>

<script>
export default {
    name: 'ne-output',
    props: {
        nId: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        scale: {
            type: Number,
            required: true
        },
        selected: {
            type: Boolean,
            default: false,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    watch: {
        x (newVal) {
            this.mainPanel.x = newVal;
        },
        y (newVal) {
            this.mainPanel.y = newVal;
        },
        scale (newVal) {
            this.mainPanel.scale = newVal;
        },
        selected (newVal) {
            this.mainPanel.selected = newVal;
        },
        value (newVal) {
            this.mainPanel.value = newVal;
        }
    },
    data () {
        return {
            mainPanel: {
                scale: this.scale,
                x: this.x,
                y: this.y,
                width: 150,
                height: 48,
                selected: this.selected,
                value: this.value
            }
        };
    },
    methods: {
        onChangeValue () {
            this.$emit('value', this.input.value);
        },
        onLeftMouseDown (event) {
            this.$emit('movenode', event);
        },
        onConnectionStart (pointNId) {
            this.$emit('connectionstart', this.nId + '#' + pointNId, false);
        },
        onConnectionEnd (pointNId) {
            this.$emit('connectionend', this.nId + '#' + pointNId, true);
        },
        getPointPosition (pointNId) {
            if (pointNId === 'i0') {
                return {
                    x: this.mainPanel.x + 10,
                    y: this.mainPanel.y + 36
                };
            } else {
                return null;
            }
        },
        formatScale (number) {
            return number / this.mainPanel.scale;
        }
    },
    mounted () {

    }
};
</script>

<style lang="scss" scoped>
@import '../../scss/base.scss';

.ne-output {
    .output-main-container {
        fill: $output-node-background;
    }

    .output-input-group {
        transform: translate(0, 24px) !important;
    }
}

</style>
