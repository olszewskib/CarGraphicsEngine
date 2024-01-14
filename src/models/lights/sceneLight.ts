import { Vec3 } from '../math/vec3';
import { ILight } from './light';

export class SceneLight implements ILight {
    location: Vec3;
    intensity: number;
    color: Vec3;

    constructor(location: Vec3, intensity: number, color: Vec3) {
        this.location = location;
        this.intensity = intensity;
        this.color = color;
    }

}