import * as Clone from './clone';

/**
 * 根据传入的拓扑计算节点的拓扑排序
 *
 * @param {AovTopo} topo 节点拓扑
 * @returns {Array.<string>|null} 计算结果
 */
export function getTopologicalOrder (topo) {
    let newTopo = Clone.deepClone(topo);
    let solution = [];
    let topoNodeList = newTopo.nodeList;
    let topoLinkList = newTopo.connection;
    for (let times = topoNodeList.length - 1; times >= 0; times--) {
        let currentNId = findFirstRootNode(newTopo);
        if (currentNId === null) {
            return null;
        }
        solution.push(currentNId[0]);
        topoNodeList.splice(currentNId[1], 1);
        for (let index = topoLinkList.length - 1; index >= 0; index--) {
            if (topoLinkList[index].range.p0.split("#")[0] === currentNId[0]) {
                topoLinkList.splice(index, 1);
            }
        }
    }
    return solution;
}

/**
 * 从拓扑图中找出第一个入度为零的节点
 *
 * @param {AovTopo} topo 节点拓扑图
 * @returns {Array.<string|number>|null} 节点的NId
 */
function findFirstRootNode(topo) {
    const topoNodeList = topo.nodeList;
    const topoLinkList = topo.connection;
    for (let index = 0; index < topoNodeList.length; index++) {
        let currentNId = topoNodeList[index].nId;
        if (checkIsRootNode(currentNId, topoLinkList)) {
            return [currentNId, index];
        }
    }
    return null;
}

/**
 * 判断指定的节点的入度是否为零
 *
 * @param {string} nodeNId 节点的NId
 * @param {Array.<NeLink>} topoLinkList 节点间连线
 * @returns {boolean} 是/否
 */
function checkIsRootNode (nodeNId, topoLinkList) {
    for (let index = 0; index < topoLinkList.length; index++) {
        let pointNId = topoLinkList[index].range.p1;
        let currentNodeNId = pointNId.split("#")[0];
        if (currentNodeNId === nodeNId) {
            return false;
        }
    }
    return true;
}
