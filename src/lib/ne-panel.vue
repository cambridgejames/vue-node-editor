<template>
    <div ref="ne-panel" class="ne-panel">
        <!--主面板-->
        <svg ref="ne-main-panel" class="ne-main-panel" :width="mainPanel.width" :height="mainPanel.height"
             :viewBox="formatScale(mainPanel.x) + ' ' + formatScale(mainPanel.y) + ' '
              + formatScale(mainPanel.width) + ' ' + formatScale(mainPanel.height)"
             @wheel.stop.prevent="onHandleScroll"
             @contextmenu.stop.prevent=""
             @mousedown.right.stop.prevent="onRightMouseDown"
             @mousemove="onMouseMove">
            <defs ref="grid-defs" class="grid-defs">
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
                    <path d="M 5000 0 L 0 0 0 5000"
                          :stroke-width="formatScale(mainPanel.scale.value >= 0.008 ? 1 : 0.5)"/>
                </pattern>
            </defs>
            <!--网格和坐标系-->
            <g ref="grid-group" class="grid-group"
               @mousedown.left.stop="onLeftMouseDown">
                <rect :x="formatScale(mainPanel.x)" :y="formatScale(mainPanel.y)"
                      :width="formatScale(mainPanel.width)" :height="formatScale(mainPanel.height)"
                      :fill="'url(#' + formatGrid(mainPanel.scale.value) + ')'"/>
                <line x1="0" :y1="formatScale(mainPanel.y)" x2="0" :y2="formatScale(mainPanel.y + mainPanel.height)"
                      :stroke-width="formatScale(1)" class="coordinate-axis"/>
                <line y1="0" :x1="formatScale(mainPanel.x)" y2="0" :x2="formatScale(mainPanel.x + mainPanel.width)"
                      :stroke-width="formatScale(1)" class="coordinate-axis"/>
            </g>
            <!--节点-->
            <g ref="node-group">
                <g v-for="(item, index) in panelInfo.content.nodeList" :key="index">
                    <!-- 输入节点 -->
                    <g v-if="item.ref === NeNodeRef.NE_INPUT_NODE">
                        <ne-text v-if="item.name === 'ne-text'" :n-id="item.nId" :x="item.x" :y="item.y"
                                 :value="item.value" :scale="mainPanel.scale.value" :selected="item.selected"
                                 :ref="'node-group-item-' + item.nId"
                                 @movenode.stop="(event) => onMoveNode(index, event)"
                                 @connectionstart="onConnectionStart"
                                 @connectionend="onConnectionEnd"></ne-text>
                    </g>
                    <!-- 处理节点 -->
                    <g v-else-if="item.ref === NeNodeRef.NE_HANDLE_NODE">
                        <ne-add v-if="item.name === 'ne-add'" :n-id="item.nId" :x="item.x" :y="item.y"
                                :value="item.value" :scale="mainPanel.scale.value" :selected="item.selected"
                                :ref="'node-group-item-' + item.nId"
                                @movenode.stop="(event) => onMoveNode(index, event)"
                                @connectionstart="onConnectionStart"
                                @connectionend="onConnectionEnd"
                                @removeinputnode="onRemoveInputNode"></ne-add>
                    </g>
                    <!-- 输出节点 -->
                    <g v-else-if="item.ref === NeNodeRef.NE_OUTPUT_NODE">
                        <ne-output v-if="item.name === 'ne-output'" :n-id="item.nId" :x="item.x" :y="item.y"
                                   :value="item.value" :scale="mainPanel.scale.value" :selected="item.selected"
                                   :ref="'node-group-item-' + item.nId"
                                   @movenode.stop="(event) => onMoveNode(index, event)"
                                   @connectionstart="onConnectionStart"
                                   @connectionend="onConnectionEnd"></ne-output>
                    </g>
                </g>
            </g>
            <!--节点间连线-->
            <g ref="connection-group" class="connection-group">
                <path ref="connection-line" class="connection-line" v-for="item in panelInfo.content.connection"
                      :d="formatConnection(item.range, true)"></path>
            </g>
            <!--工具组-->
            <g ref="tool-group" class="tool-group">
                <rect ref="selection-range" class="selection-range" v-if="selection.show"
                      :stroke-width="formatScale(1.5)" :stroke-dasharray="formatScale(4) + ',' + formatScale(4)"
                      :x="selection.range.x" :y="selection.range.y" :width="selection.range.width"
                      :height="selection.range.height"></rect>
                <path ref="connection-line" class="connection-line" v-if="connection.show"
                      :d="formatConnection(connection.range, connection.isOutput)"></path>
            </g>
        </svg>
        <div ref="ne-panel-reset" :class="{'ne-panel-reset':true, 'show':!isInitialState()}" @click="resetScale()">
            <ne-comp-svg type="reset" :width="20" :height="20"></ne-comp-svg>
        </div>
        <div ref="ne-panel-info" :class="{'ne-panel-info':true, 'show':panelInfo.show}">
            <p>缩放：{{ Math.ceil(mainPanel.scale.value * 100) }}%</p>
            <p>坐标：({{ panelInfo.mouse.realX.toFixed(1) }}, {{ panelInfo.mouse.realY.toFixed(1) }})</p>
            <p>大小：{{ formatScale(mainPanel.width).toFixed(0) }} * {{ formatScale(mainPanel.height).toFixed(0) }}</p>
        </div>
    </div>
</template>

<script>
import neCompSvg from './components/ne-comp-svg';

import * as NeNodeRefConstant from './js/constant/neNodeRefConstant';

import eventConverter from './js/event/eventConverter';
import animate from './js/animate/animate';
import * as AovTopo from './js/topo/aovTopo';
import * as Clone from './js/topo/clone';

export default {
    name: 'ne-panel',
    props: {
        init: {
            type: Object,
            required: true,
            nodeList: [],
            connection: []
        }
    },
    components: {
        neCompSvg
    },
    data () {
        return {
            NeNodeRef: NeNodeRefConstant,
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
                },
                content: {
                    nodeList: [],
                    connection: []
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
            connection: {
                show: false,
                isOutput: true,
                range: {
                    p0: '',
                    p1: {
                        x: 0,
                        y: 0
                    }
                },
                minOffset: 50
            }
        };
    },
    computed: {
        panelInfoContent () {
            return this.panelInfo.content;
        }
    },
    watch: {
        panelInfoContent: {
            handler (newValue) {
                this.refreshTopoValue(newValue);
            },
            deep: true
        }
    },
    methods: {
        /**
         * 鼠标移动响应方法，当鼠标在面板上移动时触发，显示鼠标当前的世界坐标
         *
         * @param event 鼠标事件
         */
        onMouseMove (event) {
            event = eventConverter.fixEvent(event);
            let that = this;
            that.panelInfo.mouse.realX = that.formatScale(that.mainPanel.x + event.offsetX);
            that.panelInfo.mouse.realY = that.formatScale(that.mainPanel.y + event.offsetY);
            // 显示鼠标坐标
            that.onPageInfoShow();
        },
        /**
         * 鼠标滚轮响应方法，对画布进行缩放
         *
         * @param event 鼠标事件
         */
        onHandleScroll (event) {
            event = eventConverter.fixEvent(event);
            let that = this;
            let scale = that.mainPanel.scale; // 原始缩放倍数
            if ((scale.value === scale.minValue && event.deltaY > 0)
                || (scale.value === scale.maxValue && event.deltaY <= 0)) {
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
            that.onPageInfoShow();
        },
        /**
         * 背景面板上的鼠标左键事件，包括左键单击和框选
         *
         * @param event 鼠标事件
         */
        onLeftMouseDown (event) {
            event = eventConverter.fixEvent(event);
            let that = this;
            let panel = this.$refs['ne-panel'];
            let realX = that.formatScale(that.mainPanel.x + event.offsetX);
            let realY = that.formatScale(that.mainPanel.y + event.offsetY);
            let xBefore = event.clientX;
            let yBefore = event.clientY;
            that.selection.show = true;
            panel.onmousemove = function (event) {
                let deltaX = event.clientX - xBefore;
                let deltaY = event.clientY - yBefore;
                that.selection.range.x = realX + Math.min(deltaX, 0);
                that.selection.range.y = realY + Math.min(deltaY, 0);
                that.selection.range.width = that.formatScale(Math.abs(deltaX));
                that.selection.range.height = that.formatScale(Math.abs(deltaY));
            };
            panel.onmouseleave = resetFunc;
            panel.onmouseup = function (ev) {
                if (that.selection.range.width === 0 && that.selection.range.height === 0) {
                    that.onLeftClick(ev);
                } else {
                    that.onFrameSelection();
                }
                resetFunc();
            };

            function resetFunc () {
                panel.onmousemove = null;
                panel.onmouseup = null;
                that.selection.show = false;
                that.selection.range.x = 0;
                that.selection.range.y = 0;
                that.selection.range.width = 0;
                that.selection.range.height = 0;
            }
        },
        onConnectionStart (startPointNId, isStartOutput) {
            let that = this;
            let panel = this.$refs['ne-panel'];
            let pathIndex = that.getPathIndexByPointNId(startPointNId);
            if (pathIndex === -1) {
                that.connection.range.p0 = startPointNId;
                that.connection.isOutput = isStartOutput;
            } else {
                that.connection.range.p0 = that.panelInfo.content.connection[pathIndex].range.p0;
                that.connection.isOutput = true;
            }
            let deleted = false;
            panel.onmousemove = function (event) {
                that.connection.range.p1.x = that.formatScale(that.mainPanel.x + event.offsetX);
                that.connection.range.p1.y = that.formatScale(that.mainPanel.y + event.offsetY);
                if (!deleted && pathIndex !== -1) {
                    that.panelInfo.content.connection.splice(pathIndex, 1);
                    deleted = true;
                }
                that.connection.show = true;
            };
            panel.onmouseleave = resetFunc;
            panel.onmouseup = resetFunc;

            function resetFunc () {
                panel.onmousemove = null;
                panel.onmouseup = null;
                that.connection.show = false;
            }
        },
        onConnectionEnd (endPointNId, isEndInput) {
            let that = this;
            let panel = this.$refs['ne-panel'];
            panel.onmousemove = null;
            panel.onmouseup = null;
            if (isEndInput === that.connection.isOutput) {
                if (isEndInput && that.getPathIndexByPointNId(endPointNId) === -1) {
                    that.panelInfo.content.connection.push({
                        range: {
                            p0: that.connection.range.p0,
                            p1: endPointNId
                        }
                    });
                } else if (!isEndInput) {
                    that.panelInfo.content.connection.push({
                        range: {
                            p0: endPointNId,
                            p1: that.connection.range.p0
                        }
                    });
                }
            }
            that.connection.show = false;
        },
        /**
         * 删除以pointNId所指定的输入节点为结束点的连接线
         *
         * @param {String} pointNId 指定输入节点的NId
         * @returns {void}
         */
        onRemoveInputNode (pointNId) {
            let pathIndex = this.getPathIndexByPointNId(pointNId);
            // 如果连接线存在，则index大于或等于0，否则index为-1
            if (pathIndex >= 0) {
                this.panelInfo.content.connection.splice(pathIndex, 1);
            }
        },
        /**
         * 移动节点事件
         *
         * @param index 节点序号
         * @param event 鼠标事件
         */
        onMoveNode (index, event) {
            event = eventConverter.fixEvent(event);
            let that = this;
            let panel = this.$refs['ne-panel'];
            let node = that.panelInfo.content.nodeList[index];
            let xBefore = event.clientX;
            let yBefore = event.clientY;
            panel.style.cursor = 'pointer';
            panel.onmousemove = function (subEvent) {
                subEvent = eventConverter.fixEvent(subEvent);
                node.x += (subEvent.clientX - xBefore) / that.mainPanel.scale.value;
                node.y += (subEvent.clientY - yBefore) / that.mainPanel.scale.value;
                xBefore = subEvent.clientX;
                yBefore = subEvent.clientY;
            };
            panel.onmouseleave = resetFunc;
            panel.onmouseup = function (subEvent) {
                subEvent = eventConverter.fixEvent(subEvent);
                resetFunc();
                if (event.clientX === xBefore && event.clientY === yBefore) {
                    that.onLeftClick(subEvent, node);
                }
            };

            function resetFunc () {
                panel.style.cursor = 'inherit';
                panel.onmousemove = null;
                panel.onmouseup = null;
            }
        },
        /**
         * 鼠标右键事件，包括右键单击和拖拽画布
         *
         * @param event 鼠标事件
         */
        onRightMouseDown (event) {
            event = eventConverter.fixEvent(event);
            let that = this;
            let panel = this.$refs['ne-panel'];
            let xBefore = event.clientX;
            let yBefore = event.clientY;
            panel.style.cursor = 'move';
            panel.onmousemove = function (subEvent) {
                subEvent = eventConverter.fixEvent(subEvent);
                that.mainPanel.x -= subEvent.clientX - xBefore;
                that.mainPanel.y -= subEvent.clientY - yBefore;
                xBefore = subEvent.clientX;
                yBefore = subEvent.clientY;
            };
            panel.onmouseleave = resetFunc;
            panel.onmouseup = function (subEvent) {
                subEvent = eventConverter.fixEvent(subEvent);
                resetFunc();
                if (event.clientX === xBefore && event.clientY === yBefore) {
                    that.onRightClick(subEvent);
                }
            };

            function resetFunc () {
                panel.style.cursor = 'inherit';
                panel.onmousemove = null;
                panel.onmouseup = null;
            }
        },
        /**
         * 鼠标左键单击事件
         *
         * @param event 鼠标事件
         * @param node 被点击的的节点（当点击的不是节点时为null）
         */
        onLeftClick (event, node) {
            event = eventConverter.fixEvent(event);
            console.log(event.offset);
            console.log('left click on ' + (node ? 'node' : 'panel'));
        },
        /**
         * 鼠标右键单击事件
         */
        onRightClick (/*event*/) {
            console.log('right click');
        },
        /**
         * 鼠标左键框选事件
         */
        onFrameSelection () {
            let that = this;
            console.log('selection range: [' + [that.selection.range.x, that.selection.range.y,
                that.selection.range.width, that.selection.range.height].join(', ') + ']');
        },
        /**
         * 元素大小发生改变时触发
         */
        onResize () {
            let that = this;
            let container = this.$refs['ne-panel'];
            that.mainPanel.x -= (container.offsetWidth - that.mainPanel.width) / 2;
            that.mainPanel.y -= (container.offsetHeight - that.mainPanel.height) / 2;
            that.mainPanel.width = container.offsetWidth;
            that.mainPanel.height = container.offsetHeight;
            // 显示画布大小
            that.onPageInfoShow();
        },
        /**
         * 显示右上角的组件信息
         */
        onPageInfoShow () {
            let that = this;
            that.panelInfo.show = true;
            if (that.panelInfo.timer !== null) {
                clearTimeout(that.panelInfo.timer);
            }
            that.panelInfo.timer = setTimeout(function () {
                that.panelInfo.show = false;
            }, that.panelInfo.delay);
        },
        /**
         * 根据节点的全局唯一NID计算节点的坐标
         *
         * @param {String|Object} pointNId 节点的呃全局唯一NID
         * @returns {{x: Number, y: Number}} 节点的中心坐标
         */
        getPointPositionByNId (pointNId) {
            let that = this;
            if (typeof pointNId === 'string') {
                let pointNIdArray = pointNId.split('#');
                let neNode = that.$refs['node-group-item-' + pointNIdArray[0]];
                return neNode[0].getPointPosition(pointNIdArray[1]);
            } else {
                return pointNId; // 如果传入的参数不是字符串说明这个参数就是坐标，直接返回即可
            }
        },
        /**
         * 在连线数组中查找以指定点为结束点的连线
         *
         * @param pointNId 指定点的pointNId
         * @returns {Number} 找到：连线的索引值；未找到：-1
         */
        getPathIndexByPointNId (pointNId) {
            let that = this;
            let connectionList = that.panelInfo.content.connection;
            for (let index = 0; index < connectionList.length; index++) {
                if (connectionList[index].range.p1 === pointNId) {
                    return index;
                }
            }
            return -1;
        },
        /**
         * 数值转换方法，在缩放坐标的同时保证保证线宽、尺寸等值不变
         *
         * @param number 期望显示出来的尺寸数值
         * @returns {Number} 转换后的在画布上的实际尺寸
         */
        formatScale (number) {
            return number / this.mainPanel.scale.value;
        },
        /**
         * 根据传入的放大倍数返回合适尺寸的格子
         *
         * @param number 当前的放大倍数
         * @returns {string} 当前应该使用的格子种类
         */
        formatGrid (number) {
            if (number >= 8) {
                return 'xs-grid';
            } else if (number >= 0.8) {
                return 'sm-grid';
            } else if (number >= 0.08) {
                return 'md-grid';
            } else if (number >= 0.008) {
                return 'lg-grid';
            } else {
                return '';
            }
        },
        /**
         * 根据坐标和起始点信息绘制节点间的联结三次贝塞尔曲线
         *
         * @param {Object} pathPoint 起始点和终点坐标及控制点位置设置
         * @param {String|Object} pathPoint.p0 起始点全局唯一NId
         * @param {String|Object} pathPoint.p1 终止点全局唯一NId
         * @param {Boolean} isStartOutput 线型（起始点是否是输出点）
         * @returns {string} 三次贝塞尔曲线的path路径
         */
        formatConnection (pathPoint, isStartOutput) {
            let that = this;
            let outputRatio = isStartOutput ? 1 : -1;
            let pathPointNew = {
                p0: that.getPointPositionByNId(pathPoint.p0),
                p1: that.getPointPositionByNId(pathPoint.p1)
            };
            let offset = Math.max((pathPointNew.p1.x - pathPointNew.p0.x) * outputRatio / 2, that.connection.minOffset);
            let x2 = pathPointNew.p0.x + outputRatio * offset;
            let x3 = pathPointNew.p1.x - outputRatio * offset;
            let mixArray = ['M', pathPointNew.p0.x, pathPointNew.p0.y,
                'C', x2, pathPointNew.p0.y, x3, pathPointNew.p1.y, pathPointNew.p1.x, pathPointNew.p1.y];
            return mixArray.join(' ');
        },
        /**
         * 判断视图是否处于初始状态
         *
         * @returns {Boolean} 视图是否处于初始状态
         */
        isInitialState () {
            return this.mainPanel.scale.value === 1
                && this.mainPanel.x === this.mainPanel.width / -2
                && this.mainPanel.y === this.mainPanel.height / -2;
        },
        /**
         * 重置缩放倍率
         */
        resetScale () {
            let that = this;
            let speed = 300;
            let type = 'easyInEasyOut';
            animate.execute(this.mainPanel.scale.value, 1, speed, (value) => {
                that.mainPanel.scale.value = value;
            }, type);
            animate.execute(this.mainPanel.x, that.mainPanel.width / -2, speed, (value) => {
                that.mainPanel.x = value;
            }, type);
            animate.execute(this.mainPanel.y, that.mainPanel.height / -2, speed, (value) => {
                that.mainPanel.y = value;
            }, type);
        },
        /**
         * 重新计算输出结果，通过 changetopovalue 事件返回给父组件
         */
        refreshTopoValue (newTopo) {
            let topoValue = AovTopo.getValue(newTopo);
            this.$emit('changetopovalue', topoValue);
        }
    },
    mounted () {
        let that = this;
        // 对画布尺寸进行初始化，绑定事件监听方法
        let container = that.$refs['ne-panel'];
        that.mainPanel.width = container.offsetWidth;
        that.mainPanel.height = container.offsetHeight;
        that.mainPanel.x = -container.offsetWidth / 2;
        that.mainPanel.y = -container.offsetHeight / 2;
        window.onresize = that.onResize;
        that.panelInfo.content.nodeList = Clone.deepClone(that.init.nodeList ? that.init.nodeList : []);
        that.$nextTick(function () {
            // 在初始化节点DOM完成后再创建连线
            that.panelInfo.content.connection = Clone.deepClone(that.init.connection ? that.init.connection : []);
        });
        that.$nextTick(function () {
            // 视图全部初始化结束后执行
            console.warn(`Init ne-panel: [${that.mainPanel.x}, ${that.mainPanel.y}, ${that.mainPanel.width}, ${that.mainPanel.height}]`);
        });
    }
};
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

        .connection-group {
            .connection-line {
                fill: none;
                stroke: black;
                stroke-width: 1.5;
                stroke-linecap: round;
                cursor: pointer;

                &:hover {
                    stroke: gray;
                }
            }
        }

        .tool-group {
            .selection-range {
                fill: none;
                stroke: $selection-box-color;
            }

            .connection-line {
                fill: none;
                stroke: black;
                stroke-width: 1.5;
                stroke-linecap: round;
            }
        }
    }

    .ne-panel-reset {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: absolute;
        left: 10px;
        top: 10px;
        padding: 10px;
        background-color: $tips-background;
        fill: #fff;
        opacity: 0;
        transition: all .3s ease-in-out;
        cursor: pointer;

        &[class*=show] {
            opacity: 1;
        }
    }

    .ne-panel-info {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: absolute;
        right: 10px;
        top: 10px;
        padding: 10px;
        color: #fff;
        font-size: 12px;
        background-color: $tips-background;
        opacity: 0;
        transition: all .3s ease-in-out;

        &[class*=show] {
            opacity: 1;
        }
    }
}
</style>
