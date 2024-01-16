import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { CarLight } from "../lights/carLight";
import { ILight } from "../lights/light";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { Vec3 } from "../math/vec3";
import { TileModel } from "./tileModel";

export class Tile {
    
    model: TileModel;
    modelMatrix: M4;
    readonly worldLights: ILight[];

    constructor(model: TileModel, worldLights: ILight[], modelMatrix: M4) {
        this.model = model;
        this.worldLights = worldLights;
        this.modelMatrix = modelMatrix;
    }

    draw(gl: WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3, t: number[] = [0,0,0]) {
        
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(attributes.a_vertex);
        gl.enableVertexAttribArray(attributes.a_texcoord);
    
        var lights: number[] = []
        this.worldLights.forEach(light => { 
            lights.push(...light.location.getVec3ForBuffer());
        });

        var lightColors: number[] = [];
        this.worldLights.forEach(light => {
            var color = light.color.getVec3ForColorBuffer();
            color = color.map(color => color * light.intensity);
            lightColors.push(...color);
        });

        gl.uniform3fv(attributes.u_lightWorldPosition, lights);
        gl.uniform3fv(attributes.u_eyePosition,cameraPosition.getVec3ForBuffer());
        gl.uniform3fv(attributes.u_lightColor,lightColors);
        gl.uniform1f(attributes.u_m, this.model.colorModel.m);
        gl.uniform1f(attributes.u_ks, this.model.colorModel.ks);
        gl.uniform1f(attributes.u_kd, this.model.colorModel.kd);
        gl.uniform1f(attributes.u_fogAmount, this.model.colorModel.fogAmount);
        gl.uniform1i(attributes.u_shadingMode, this.model.colorModel.shadingMode);
        gl.uniform1f(attributes.u_kc, 1.0);
        gl.uniform1f(attributes.u_kl, 0.014);
        gl.uniform1f(attributes.u_kq, 0.000007);
        gl.uniform1i(attributes.u_texture, 0);
        gl.uniform1i(attributes.u_normalTexture, 1);
    
        var vertexBuffer = createStaticVertexBuffer(gl, this.model.verticesBuffer);
        var textureBuffer = createStaticVertexBuffer(gl, this.model.textureBuffer);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);
   
        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.normalTexture);

        var transaltionMatrix = M4.translation(t[0], t[1], t[2]);
        var modelMatrix = M4.multiply(this.modelMatrix, transaltionMatrix);

    
        var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
        gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesBuffer.length / 3);
    }
}