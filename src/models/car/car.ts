import { GlAttributes, bindTexture, createStaticVertexBuffer } from "../../webGL";
import { CarLight } from "../lights/carLight";
import { Vec3 } from "../math/vec3";
import { CarModel } from "./carModel";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";

export class Car {
    
    model: CarModel;
    readonly mainLight: Vec3;
    readonly carLights: CarLight[];

    constructor(model: CarModel,mainLight: Vec3, lights: CarLight[]) {
        this.model = model;
        this.mainLight = mainLight;
        this.carLights = lights;
    }

    bind(gl: WebGL2RenderingContext, program: WebGLProgram, texture: HTMLImageElement, normalMap: HTMLImageElement) {
        bindTexture(gl,program,texture,normalMap);
    }

    drawCar(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3) {
        
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(attributes.a_vertex);
        gl.enableVertexAttribArray(attributes.a_color);
        gl.enableVertexAttribArray(attributes.a_texcoord);
        gl.enableVertexAttribArray(attributes.a_normal);

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
        gl.uniform3fv(attributes.u_lightColor, lightColors);
        gl.uniform1f(attributes.u_m, this.model.mirror);
        gl.uniform1f(attributes.u_ks, this.model.ks);
        gl.uniform1f(attributes.u_kd, this.model.kd);
    
        var color = [0,255,0];
        var rgb = [];
        for(var i = 0; i < this.model.verticesBuffer.length; i+=9) {
            rgb.push(...color);
            rgb.push(...color);
            rgb.push(...color);
        }
    
        var vertexBuffer = createStaticVertexBuffer(gl, this.model.verticesBuffer);
        var colorBuffer = createStaticVertexBuffer(gl, new Uint8Array(rgb));
        var normalsBuffer = createStaticVertexBuffer(gl, this.model.normalsBuffer);
        var textureBuffer = createStaticVertexBuffer(gl, this.model.textureBuffer);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.vertexAttribPointer(attributes.a_normal, 3, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);
    
        var modelMatrix = M4.scaling(200,200,200);
        var xRotationMatrix = M4.rotationX(deg2rad(90));
        var zRotationMatrix = M4.rotationZ(deg2rad(180));
        var translationMatrix = M4.translation(500,500,115);
        modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    
        var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
        gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesBuffer.length / 3);
    }


}