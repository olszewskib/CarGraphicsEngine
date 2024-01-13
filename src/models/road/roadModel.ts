export class RoadModel {
    verticesBuffer: Float32Array;
    textureBuffer: Float32Array;
    mirror: number;
    ks: number;
    kd: number;

    constructor(verticesBuffer: Float32Array, textureBuffer: Float32Array, mirror: number, ks: number, kd: number) {
        this.verticesBuffer = verticesBuffer;
        this.textureBuffer = textureBuffer;
        this.mirror = mirror;
        this.ks = ks;
        this.kd = kd;
    }

}