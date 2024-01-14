import { Vec3 } from "../math/vec3";

export interface ILight {
    location: Vec3;
    intensity: number;
    color: Vec3;
}