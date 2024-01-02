
export class Vec4 {
    v1: number;
    v2: number;
    v3: number;
    v4: number;

    constructor(v1:number, v2:number, v3:number, v4:number) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.v4 = v4;
    }

    getVec4ForBuffer(): Float32Array {
        return new Float32Array([this.v1,this.v2,this.v3,this.v4]);
    }
}