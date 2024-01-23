
import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { Vec3 } from "../math/vec3";
import { ObjModel } from "../objModel";
import { M4 } from "../math/m4";
import { ILight } from "../lights/light";
import { Camera } from "../camera/camera";
import { IRenderObject } from "../renderObject";

export class Lamp implements ILight, IRenderObject {
    
    model: ObjModel;
    modelMatrix: M4;
    location: Vec3;
    intensity: number;
    color: Vec3;
    worldLights: ILight[];
    camera: Camera
    cachedModelMatrix: M4;

    constructor(model: ObjModel, worldLights: ILight[], modelMatrix: M4, location: Vec3, intensity: number, color: Vec3, camera: Camera) {
        this.model = model;
        this.location = location;
        this.intensity = intensity;
        this.color = color;
        this.worldLights = worldLights;
        this.modelMatrix = modelMatrix
        this.camera = camera;
        this.cachedModelMatrix = modelMatrix;
        worldLights.push(this);
    }
    
    getPosition(): Vec3 {
        var x = this.modelMatrix.values[3][0];
        var y = this.modelMatrix.values[3][1];
        var z = this.modelMatrix.values[3][2];
        var w = this.modelMatrix.values[3][3];
        return new Vec3(x/w,y/w,z/w);
    }

    setInitialModelMatrix(): void {
        this.modelMatrix = this.cachedModelMatrix;
    }

    draw(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, t: number[] = [0,0,0]) {
        
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(attributes.a_vertex);
        gl.enableVertexAttribArray(attributes.a_texcoord);
        gl.enableVertexAttribArray(attributes.a_normal);

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
        gl.uniform3fv(attributes.u_eyePosition,this.camera.position.getVec3ForBuffer());
        gl.uniform3fv(attributes.u_lightColor, lightColors);
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
        var normalsBuffer = createStaticVertexBuffer(gl, this.model.normalsBuffer);
        var textureBuffer = createStaticVertexBuffer(gl, this.model.textureBuffer);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.vertexAttribPointer(attributes.a_normal, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);
    
        gl.uniform1i(attributes.u_texture, 0);
        gl.uniform1i(attributes.u_normalTexture, 1);
   
        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.normalTexture);

        var transaltionMatrix = M4.translation(t[0], t[1], t[2]);
        var modelMatrix = M4.multiply(this.modelMatrix, transaltionMatrix);
    
        var worldViewProjectionMatrix = M4.multiply(modelMatrix,this.camera.matrix);
        gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesBuffer.length / 3);
    }


}