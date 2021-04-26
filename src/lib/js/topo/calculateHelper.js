/**
 * 根据节点的NID查询其所依赖的节点
 *
 * @param {string} nodeNId 目标节点的NID
 * @param {Array<NeLink>} neLinkList 节点间连线
 * @returns {{string: string}} 目标节点各个输入点的NID:依赖的输出点的NID
 */
export function getDependency(nodeNId, neLinkList) {
    let solution = {};
    for (let index = 0; index < neLinkList.length; index++) {
        let linkRange = neLinkList[index].range;
        let nIds = linkRange.p1.split('#');
        if (nIds[0] === nodeNId) {
            solution[nIds[1]] = linkRange.p0;
        }
    }
    return solution;
}
