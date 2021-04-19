import * as NeNodeRefConstant from '../constant/neNodeRefConstant';

import * as Clone from './clone';

/**
 * 根据传入的拓扑计算节点的拓扑排序
 *
 * @param {AovTopo} topo 节点拓扑
 * @returns {Array.<{string: any}>} 计算结果
 */
export function getTopologicalOrder (topo) {
    let newTopo = Clone.deepClone(topo);

    return [{'a': 1}];
}

/**
 * 判断指定的节点的入度是否为零
 *
 * @param {string} nodeNId 节点的NId
 * @param {Array.<NeLink>} topoLink 节点间连线
 * @returns {boolean} 是/否
 */
function checkIsRootNode (nodeNId, topoLink) {
    return false;
}
