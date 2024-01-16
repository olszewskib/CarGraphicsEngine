import { ColorModel } from "../colors/colorModel";

export class TileModel {
    verticesBuffer: Float32Array;
    textureBuffer: Float32Array;
    texture: WebGLTexture;
    normalTexture: WebGLTexture;
    colorModel: ColorModel

    constructor(
        verticesBuffer: Float32Array, 
        textureBuffer: Float32Array,
        texture: WebGLTexture,
        normalTexture: WebGLTexture,
        colorModel: ColorModel
        ) {

        this.verticesBuffer = verticesBuffer;
        this.textureBuffer = textureBuffer;
        this.texture = texture;
        this.normalTexture = normalTexture;
        this.colorModel = colorModel;
    }

}