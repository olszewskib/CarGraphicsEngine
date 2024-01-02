import { Vec3 } from "./vec3";
import type { Vec4 } from "./vec4";

export class Vertex {
    x: number;
    y: number;
    z: number;
    normal: Vec3 | undefined;
    dU: Vec3;
    dV: Vec3;
    color: Vec4 | undefined;

    constructor(x: number, y:number, z:number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.dU = new Vec3();
        this.dV = new Vec3();
    }

    setNormal(normal: Vec3) {
        this.normal = normal;
    }

    setdU(dU: Vec3) {
        if(Math.abs(dU.v1) < 0.0000000001)
            dU.v1 = 0;
        if(Math.abs(dU.v2) < 0.0000000001)
            dU.v2 = 0;
        if(Math.abs(dU.v2) < 0.0000000001)
            dU.v2 = 0;
        this.dU = dU;
    }

    setdV(dV: Vec3) {
        if(Math.abs(dV.v1) < 0.0000000001)
            dV.v1 = 0;
        if(Math.abs(dV.v2) < 0.0000000001)
            dV.v2 = 0;
        if(Math.abs(dV.v2) < 0.0000000001)
            dV.v2 = 0;
        this.dV = dV;
    }

    setColor(color: Vec4) {
        this.color = color; 
    }

    getVec3ForBuffer(): number[] {
        return new Array(this.x,this.y,this.z);
    }

    getVec2ForBuffer(): number[] {
        return new Array(this.x,this.y);
    }
}