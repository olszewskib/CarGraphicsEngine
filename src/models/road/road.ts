import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { CarLight } from "../lights/carLight";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { Vec3 } from "../math/vec3";
import { RoadModel } from "./roadModel";

export class Road {
    
    model: RoadModel;
    readonly mainLight: Vec3;
    readonly carLights: CarLight[];

    constructor(model: RoadModel,mainLight: Vec3, lights: CarLight[]) {
        this.model = model;
        this.mainLight = mainLight;
        this.carLights = lights;
    }

    draw(gl: WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3, dy: number) {
        
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(attributes.a_vertex);
        gl.enableVertexAttribArray(attributes.a_texcoord);
    
        var lights = [...this.mainLight.getVec3ForBuffer()]
        this.carLights.forEach(light => { 
            lights.push(...light.location.getVec3ForBuffer());
        });

        var lightColors = [1,1,1];
        this.carLights.forEach(light => { 
            lightColors.push(...light.color.getVec3ForColorBuffer());
        });

        gl.uniform3fv(attributes.u_lightWorldPosition, lights);
        gl.uniform3fv(attributes.u_eyePosition,cameraPosition.getVec3ForBuffer());
        gl.uniform3fv(attributes.u_lightColor,lightColors);
        gl.uniform1f(attributes.u_m, this.model.mirror);
        gl.uniform1f(attributes.u_ks, this.model.ks);
        gl.uniform1f(attributes.u_kd, this.model.kd);
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

        var modelMatrix = M4.scaling(1000,1000,1000);
        var zRotationMatrix = M4.rotationZ(deg2rad(90));
        var translationMatrix = M4.translation(1000,dy,0);
        modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    
        var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
        gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesBuffer.length / 3);
    }
}