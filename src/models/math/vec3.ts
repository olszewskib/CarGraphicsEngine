import type { Point3D } from "src/models/bezier/BezierSurface";

export class Vec3 {
    v1: number;
    v2: number;
    v3: number;

    constructor(v1:number = 0, v2:number = 0, v3:number = 0) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    static crossProduct(v: Vec3, u: Vec3): Vec3 {
        var x: number = v.v2 * u.v3 - v.v3 * u.v2;
        var y: number = v.v3 * u.v1 - v.v1 * u.v3;
        var z: number = v.v1 * u.v2 - v.v2 * u.v1;

        return new Vec3(x,y,z);
    }

    static subtractVectors(v: Vec3, u: Vec3): Vec3 {
        var x: number = v.v1 - u.v1;
        var y: number = v.v2 - u.v2;
        var z: number = v.v3 - u.v3;

        return new Vec3(x,y,z);
    }

    normalize(): void {
        var len: number = this.lenght()

        // don't want to divide by 0
        if(len > 0.000001) {
            this.v1 /= len;
            this.v2 /= len;
            this.v3 /= len;
        } else {
            this.v1 = 0;
            this.v2 = 0;
            this.v3 = 0;
        }
    }

    static scale(v: Vec3, scalar: number): Vec3 {
        return new Vec3(
            v.v1*scalar,
            v.v2*scalar,
            v.v3*scalar
        );
    }

    static convertFromPoint3D(point: Point3D): Vec3 {
        return new Vec3(point.x,point.y,point.z);
    }

    static convertFromHEX(hex: string, normalize: boolean = false) {
        var r:number = parseInt(hex.slice(1,3),16);
        var g:number = parseInt(hex.slice(3,5),16);
        var b:number = parseInt(hex.slice(5,7),16);

        var result:Vec3 = new Vec3(r,g,b);

        if(normalize) {
            result.v1 /= 255;
            result.v2 /= 255;
            result.v3 /= 255;
        }

        return result;
    }

    rotate(rad: number, x: number, y:number) {

        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var tmpX = this.v1 - x;
        var tmpY = this.v2 - y;

        this.v1 = tmpX * c - tmpY * s + x;
        this.v2 = tmpX * s + tmpY * c + y; 
    }

    add(v: Vec3): void {
        this.v1 += v.v1;
        this.v2 += v.v2;
        this.v3 += v.v3;
    }

    lenght(): number {
        return Math.sqrt(this.v1 * this.v1 + this.v2 * this.v2 + this.v3 * this.v3);
    }

    getVec3ForBuffer(): number[] {
        return new Array(this.v1,this.v2,this.v3);
    }
}