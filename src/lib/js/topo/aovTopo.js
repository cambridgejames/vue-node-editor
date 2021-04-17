import * as NeNodeRefConstant from '../constant/neNodeRefConstant';

import * as Clone from './clone';

/**
 * 根据传入的拓扑计算输出结果
 *
 * @param {Object} topo 节点拓扑
 * @returns {[{String: Object}]} 计算结果
 */
export function getValue (topo) {
    let newTopo = Clone.deepClone(topo);
    const nodeList = newTopo.nodeList;
    const outputNodeList = [];
    for (let index in nodeList) {
        let node = nodeList[index];
        if (node.ref === NeNodeRefConstant.NE_OUTPUT_NODE) {
            let outputData = {};
            outputData[node.value] = {};
            outputNodeList.push(outputData);
        }
    }
    return outputNodeList;
}
