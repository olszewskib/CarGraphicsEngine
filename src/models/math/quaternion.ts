import { Vec3 } from "./vec3";

export class Quaternion {
    constructor(public w: number, public x: number, public y: number, public z: number) {}

    static fromEuler(roll: number, pitch: number, yaw: number): Quaternion {
        var cy = Math.cos(yaw * 0.5);
        var sy = Math.sin(yaw * 0.5);
        var cp = Math.cos(pitch * 0.5);
        var sp = Math.sin(pitch * 0.5);
        var cr = Math.cos(roll * 0.5);
        var sr = Math.sin(roll * 0.5);

        return new Quaternion(
            cr * cp * cy + sr * sp * sy,
            sr * cp * cy - cr * sp * sy,
            cr * sp * cy + sr * cp * sy,
            cr * cp * sy - sr * sp * cy
        );
    }

    rotateVector(vec: Vec3): Vec3 {
        var qVec = new Quaternion(0, vec.v1, vec.v2, vec.v3);
        var qConjugate = new Quaternion(this.w, -this.x, -this.y, -this.z);
        var result = this.multiply(qVec).multiply(qConjugate);

        return new Vec3(result.x, result.y, result.z);
    }

    multiply(other: Quaternion): Quaternion {
        return new Quaternion(
            this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
            this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
            this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
            this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
        );
    }
}

function deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180);
}