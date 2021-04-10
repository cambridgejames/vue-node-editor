<template>
    <g ref="ne-add" class="ne-node ne-add" :transform="'translate(' + mainPanel.x + ',' + mainPanel.y + ')'">
        <rect ref="add-main-container"
              :class="{'main-container':true, 'add-main-container':true, 'selected':mainPanel.selected}"
              x="0" y="0" :width="mainPanel.width" :height="(mainPanel.value.length + 3) * 24"/>
        <g ref="add-title-group" class="title-group"
           @mousedown.left.stop="onLeftMouseDown">
            <rect ref="add-title-back" class="title-back" x="0" y="0" :width="mainPanel.width"/>
            <text ref="add-title-text" class="title-text" :x="mainPanel.width / 2" y="16">加</text>
        </g>
        <g ref="add-output-group" class="output-group">
            <text ref="add-output-text" class="output-text" :x="mainPanel.width - 20" y="16">值</text>
            <circle ref="output-point" class="output-point" :cx="mainPanel.width - 10" cy="12" r="4" n-id="o0"
                    @mousedown.left.stop.prevent="onConnectionStart('o0')"
                    @mouseup.left.stop.prevent="onConnectionEnd('o0')"/>
        </g>
        <g ref="add-input-group" class="input-group add-input-group">
            <g class="add-input-box" v-for="(item, index) in mainPanel.value" :key="index">
                <rect ref="add-input-background" class="add-input-background" x="1" :y="index * 24" width="148"
                      height="24"/>
                <text ref="add-input-text" class="input-text" x="20" :y="16 + index * 24">
                    {{ '加数' + (index + 1)}}
                </text>
                <circle ref="input-point" class="input-point" cx="10" :cy="12 + index * 24" r="4" :n-id="'i' + index"
                        @mousedown.left.stop.prevent="onConnectionStart('i' + item)"
                        @mouseup.left.stop.prevent="onConnectionEnd('i' + item)"/>
                <g ref="minus-button-group" class="minus-button-group" @click="removeInputNode('i' + item)">
                    <rect ref="minus-button-box" class="minus-button-box" x="131" :y="index * 24 + 5" width="14"
                          height="14"/>
                    <ne-comp-svg ref="minus-button" class="minus-button" type="minus" x="131" :y="index * 24 + 5"
                                 :width="14" :height="14"/>
                </g>
            </g>
        </g>
        <g ref="add-button-group" class="add-button-group" @click="addInputNode()">
            <rect ref="add-button-background" class="add-button-background" x="1" :y="(mainPanel.value.length + 2) * 24"
                  width="148" height="23"/>
            <ne-comp-svg ref="add-button" class="add-button" type="add" x="68"
                         :y="(mainPanel.value.length + 2) * 24 + 4"
                         :width="14" :height="14"/>
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
            this.$emit('connectionstart', this.getFullPointNID(pointNId), pointNId.charAt(0) === 'o');
        },
        onConnectionEnd (pointNId) {
            this.$emit('connectionend', this.getFullPointNID(pointNId), pointNId.charAt(0) === 'i');
        },
        /**
         * 根据节点的NID获取节点在画布上的实际坐标
         *
         * @param {String} pointNId 节点的NID
         * @returns {{x: Number, y: Number}|Null} 节点在画布上面的坐标
         */
        getPointPosition (pointNId) {
            if (pointNId === 'o0') {
                return {
                    x: this.mainPanel.x + this.mainPanel.width - 10,
                    y: this.mainPanel.y + 36
                };
            } else if (pointNId.charAt(0) === 'i') {
                let nIdValueIndex = this.mainPanel.value.indexOf(parseInt(pointNId.substr(1)));
                if (nIdValueIndex <= -1) {
                    return null;
                }
                return {
                    x: this.mainPanel.x + 10,
                    y: this.mainPanel.y + 60 + nIdValueIndex * 24
                };
            } else {
                return null;
            }
        },
        formatScale (number) {
            return number / this.mainPanel.scale;
        },
        /**
         * 添加输入节点
         */
        addInputNode () {
            let value = this.mainPanel.value;
            let lastNIdValue = value.length === 0 ? 0 : value[value.length - 1];
            this.mainPanel.value.push(lastNIdValue + 1);
        },
        /**
         * 删除输入节点
         *
         * @param {String} pointNId 输入节点的NID
         * @returns {void}
         */
        removeInputNode(pointNId) {
            if (pointNId.charAt(0) !== 'i') {
                return;
            }
            let nIdValueIndex = this.mainPanel.value.indexOf(parseInt(pointNId.substr(1)));
            if (nIdValueIndex <= -1) {
                return;
            }
            this.$emit('removeinputnode', this.getFullPointNID(pointNId)); // 先删线再删点，否则会报错
            this.mainPanel.value.splice(nIdValueIndex, 1);
        },
        /**
         * 根据节点的NID获取完整的全局NID
         *
         * @param {String} pointNId 输入/输出节点的NID
         * @returns {String} 画布全局唯一NID
         */
        getFullPointNID(pointNId) {
            return this.nId + '#' + pointNId;
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

    .add-input-box {
        .add-input-background {
            fill: white;
            opacity: 0;
        }

        .minus-button-group {
            cursor: pointer;

            .minus-button-box {
                opacity: 0;
            }

            &:hover {
                .minus-button {
                    fill: white;
                }
            }
        }

        &:hover {
            .add-input-background {
                opacity: 0.3;
            }
        }
    }

    .add-button-group {
        cursor: pointer;

        .add-button-background {
            fill: white;
            opacity: 0;
        }

        .add-button {
            display: inline-block;
        }

        &:hover {
            .add-button-background {
                opacity: 0.3;
            }

            .add-button {
                fill: white;
            }
        }
    }
}

</style>
