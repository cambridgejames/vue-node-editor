/**
 * 拓扑
 */
export interface AovTopo {
    nodeList: Array<NeNode>;
    connection: Array<NeLink>;
}

export interface NeNode {
    nId: string;
    name: string;
    ref: string;
    x: number;
    y: number;
    value: string | Array<any>;
}

export interface NeLink {
    range: {
        p0: string;
        p1: string;
    }
}
