/**
 * 递归实现对象的深拷贝
 *
 * @param {T} object 待拷贝对象
 * @returns {T} 拷贝结果
 * @template T
 */
export function deepClone (object) {
    // 判断拷贝的要进行深拷贝的是数组还是对象
    let objClone = Array.isArray(object) ? [] : {};
    if (object && typeof object === 'object') {
        for (let index in object) {
            if (object.hasOwnProperty(index)) {
                if (object[index] && typeof object[index] === 'object') {
                    objClone[index] = deepClone(object[index]);
                } else {
                    objClone[index] = object[index];
                }
            }
        }
    }
    return objClone;
}
