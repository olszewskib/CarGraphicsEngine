import { ColorModel } from "./colors/colorModel";

export class ObjModel {
    verticesBuffer: Float32Array;
    normalsBuffer: Float32Array;
    textureBuffer: Float32Array;
    texture: WebGLTexture;
    normalTexture: WebGLTexture;
    colorModel: ColorModel

    constructor(
        verticesBuffer: Float32Array,
        normalsBuffer: Float32Array,
        textureBuffer: Float32Array,
        texture: WebGLTexture,
        normalTexture: WebGLTexture,
        colorModel: ColorModel
        ){

        this.verticesBuffer = verticesBuffer;
        this.normalsBuffer = normalsBuffer;
        this.textureBuffer = textureBuffer;
        this.texture = texture;
        this.normalTexture = normalTexture;
        this.colorModel = colorModel;
    }
}