export default {
    name: 'animate',
    data() {
        return {
            animateList: [],
            animateTimer: null
        }
    },
    /**
     *
     * @param {Number} startValue
     * @param {Number} endValue
     * @param {Number} speed
     * @param {Function} callback
     * @param {String} type
     */
    execute(startValue, endValue, speed, callback, type='liner') {
        let that = this;
        that.animateList.push({
            startValue: startValue,
            endValue: endValue,
            startTime: new Date(),
            speed: speed,
            callback: callback,
            type: type
        });
        if (that.animateTimer == null) {
            // 每13毫秒执行一帧
            that.animateTimer = that.setInterval(() => {
                let realTime = new Date();
                for (let i = 0; i < that.animateList.length; i++) {
                    let item = that.animateList[i];
                    let progress = speed / (realTime - item.startTime);
                    if (progress < 0 || progress > 1) {
                        that.animateList.splice(i, 0);
                    }
                    doAnimate(item.startValue, item.endValue, progress, item.callback, item.type);
                }
            }, 13);
        }
    }
}

/**
 * 根据动画种类执行动画方法
 *
 * @param {Number} startValue 起始值
 * @param {Number} endValue 结束值
 * @param {Number} progress 进度（0~1）
 * @param {Function} callback 回调函数，用于用户自定义更新变量的值
 * @param {String} type 动画执行方式
 * @returns {VoidFunction}
 */
function doAnimate(startValue, endValue, progress, callback, type='liner') {
    let realProgress = Math.min(Math.max(progress, 0), 1);
    switch (type) {
        case 'liner':
            liner(startValue, endValue, realProgress, callback);
            break;
        case 'easyIn':
            easyIn(startValue, endValue, realProgress, callback);
            break;
        case 'easyOut':
            easyOut(startValue, endValue, realProgress, callback);
            break;
        case 'easyInEasyOut':
            easyInEasyOut(startValue, endValue, realProgress, callback);
            break;
        default:
            liner(startValue, endValue, realProgress, callback);
    }
}

/**
 * 计算线性动画指定进度的值
 *
 * @param {Number} startValue 起始值
 * @param {Number} endValue 结束值
 * @param {Number} progress 进度（0~1）
 * @param {Function} callback 回调函数，用于用户自定义更新变量的值
 * @returns {VoidFunction}
 */
function liner(startValue, endValue, progress, callback) {
    callback(startValue + (endValue - startValue) * progress);
}

/**
 * 计算缓入动画指定进度的值
 *
 * @param {Number} startValue 起始值
 * @param {Number} endValue 结束值
 * @param {Number} progress 进度（0~1）
 * @param {Function} callback 回调函数，用于用户自定义更新变量的值
 * @returns {VoidFunction}
 */
function easyIn(startValue, endValue, progress, callback) {
    callback((endValue - startValue) * progress * progress + startValue);
}

/**
 * 计算缓出动画指定进度的值
 *
 * @param {Number} startValue 起始值
 * @param {Number} endValue 结束值
 * @param {Number} progress 进度（0~1）
 * @param {Function} callback 回调函数，用于用户自定义更新变量的值
 * @returns {VoidFunction}
 */
function easyOut(startValue, endValue, progress, callback) {
    callback((startValue - endValue) * (progress - 2) * progress + startValue);
}

/**
 * 计算缓入缓出动画指定进度的值
 *
 * @param {Number} startValue 起始值
 * @param {Number} endValue 结束值
 * @param {Number} progress 进度（0~1）
 * @param {Function} callback 回调函数，用于用户自定义更新变量的值
 * @returns {VoidFunction}
 */
function easyInEasyOut(startValue, endValue, progress, callback) {
    let half = (startValue + endValue) / 2;
    if (progress < 0.5) {
        easyIn(startValue, half, progress * 2, callback);
    } else {
        easyOut(half, endValue, (progress - 0.5) * 2, callback);
    }
}
