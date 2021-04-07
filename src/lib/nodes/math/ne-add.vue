<template>
    <g ref="ne-add" class="ne-node ne-add" :transform="'translate(' + mainPanel.x + ',' + mainPanel.y + ')'">
        <rect ref="add-main-container"
              :class="{'main-container':true, 'add-main-container':true, 'selected':mainPanel.selected}"
              x="0" y="0" :width="mainPanel.width" :height="mainPanel.height"></rect>
        <g ref="add-title-group" class="title-group"
           @mousedown.left.stop="onLeftMouseDown">
            <rect ref="add-title-back" class="title-back" x="0" y="0" :width="mainPanel.width"></rect>
            <text ref="add-title-text" class="title-text" :x="mainPanel.width / 2" y="16">加</text>
        </g>
        <g ref="add-output-group" class="output-group">
            <text ref="add-output-text" class="output-text" :x="mainPanel.width - 20" y="16">值</text>
            <circle ref="output-point" class="output-point" :cx="mainPanel.width - 10" cy="12" r="4" n-id="o0"
                    @mousedown.left.stop.prevent="onConnectionStart('o0')"
                    @mouseup.left.stop.prevent="onConnectionEnd('o0')"></circle>
        </g>
        <g ref="add-input-group" class="input-group add-input-group">
            <g v-for="(item, index) in mainPanel.value" :key="index">
                <text ref="add-input-text" class="input-text" x="20" :y="16 + index * 24">{{ item }}</text>
                <circle ref="input-point" class="input-point" cx="10" :cy="12 + index * 24" r="4" :n-id="'i' + index"
                        @mousedown.left.stop.prevent="onConnectionStart('i' + index)"
                        @mouseup.left.stop.prevent="onConnectionEnd('i' + index)"></circle>
            </g>
        </g>
        <g ref="add-button-group" class="add-button-group">
            <rect ref="add-button-background" class="add-button-background" x="1" :y="(mainPanel.value.length + 2) * 24"
                  width="148" height="23"></rect>
            <ne-comp-svg ref="add-button" class="add-button" type="add" x="68" :y="(mainPanel.value.length + 2) * 24 + 4"
                         :width="14" :height="14" />
        </g>
    </g>
</template>

<script>
import neCompSvg from '../../components/ne-comp-svg';

export default {
    name: 'ne-add',
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
        value: {
            type: Array,
            required: false
        },
        scale: {
            type: Number,
            required: true
        },
        selected: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    components: {
        neCompSvg
    },
    watch: {
        value (newVal) {
            this.mainPanel.value = newVal;
        },
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
        }
    },
    data () {
        return {
            mainPanel: {
                scale: this.scale,
                x: this.x,
                y: this.y,
                width: 150,
                height: 0,
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
            this.$emit('connectionstart', this.nId + '#' + pointNId, pointNId.charAt(0) === 'o');
        },
        onConnectionEnd (pointNId) {
            this.$emit('connectionend', this.nId + '#' + pointNId, pointNId.charAt(0) === 'i');
        },
        getPointPosition (pointNId) {
            if (pointNId === 'o0') {
                return {
                    x: this.mainPanel.x + this.mainPanel.width - 10,
                    y: this.mainPanel.y + 36
                };
            } else if (pointNId.charAt(0) === 'i') {
                return {
                    x: this.mainPanel.x + 10,
                    y: this.mainPanel.y + 60 + parseInt(pointNId.substr(1)) * 24
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
        this.mainPanel.height = (this.mainPanel.value.length + 3) * 24;
    }
};
</script>

<style lang="scss" scoped>
@import '../../scss/base.scss';

.ne-add {
    .add-main-container {
        fill: $math-node-background;
    }

    .add-button-group {
        cursor: pointer;

        .add-button-background {
            fill: white;
            opacity: 0;
            -webkit-transition: opacity .1s;
            -moz-transition: opacity .1s;
            -o-transition: opacity .1s;
            transition: opacity .1s;
        }

        .add-button {
            -webkit-transition: transform .3s, fill .1s;
            -moz-transition: transform .3s, fill .1s;
            -o-transition: transform .3s, fill .1s;
            transition: transform .3s, fill .1s;
        }

        &:hover {
            .add-button-background {
                opacity: 0.3;
            }

            .add-button {
                fill: white;
                -webkit-transform: rotate(7deg);
                -moz-transform: rotate(7deg);
                -ms-transform: rotate(7deg);
                -o-transform: rotate(7deg);
                transform: rotate(7deg);
            }
        }
    }
}

</style>
