import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { CarLight } from "../lights/carLight";
import { Vec3 } from "../math/vec3";
import { CarModel } from "./carModel";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";

export class Car {
    
    model: CarModel;
    modelMatrix: M4;
    currentPosition: Vec3 = new Vec3(0,0,0);
    rotation: number = 0
    readonly mainLight: Vec3;
    readonly carLights: CarLight[];

    constructor(model: CarModel,mainLight: Vec3, lights: CarLight[]) {
        this.model = model;
        this.mainLight = mainLight;
        this.carLights = lights;
        this.modelMatrix = new M4();
        this.setInitialModelMatrix();

    }

    private setInitialModelMatrix() {
        var modelMatrix = M4.scaling(200,200,200);
        var xRotationMatrix = M4.rotationX(deg2rad(90));
        var zRotationMatrix = M4.rotationZ(deg2rad(180));
        var translationMatrix = M4.translation(500,500,115);
        modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,translationMatrix);
        this.modelMatrix = modelMatrix;
        this.currentPosition = new Vec3(500,500,115);
    }

    move(transformationMatrix: M4): void {
        this.currentPosition.v1 += transformationMatrix.values[3][0];
        this.currentPosition.v2 += transformationMatrix.values[3][1];
        this.currentPosition.v3 += transformationMatrix.values[3][2];
        this.modelMatrix = M4.multiply(this.modelMatrix,transformationMatrix);
        this.carLights.forEach(light => { 
            light.move(transformationMatrix);
        });
    }

    rotate(deg: number) {
        this.rotation += deg;
        this.rotation = this.rotation % 360;

        var cachedPosition = new Vec3(this.currentPosition.v1,this.currentPosition.v2,this.currentPosition.v3);
        this.move(M4.translation(-this.currentPosition.v1,-this.currentPosition.v2,-this.currentPosition.v3));
        this.move(M4.rotationZ(deg2rad(deg)));
        this.move(M4.translation(cachedPosition.v1,cachedPosition.v2,cachedPosition.v3));
    }

    drive(distance: number) { 
        var dx = Math.cos(deg2rad(this.rotation)) * distance;
        var dy = Math.sin(deg2rad(this.rotation)) * distance;
        this.move(M4.translation(dy,-dx,0));
    }

    draw(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3) {
        
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
    
        gl.uniform1i(attributes.u_texture, 0);
        gl.uniform1i(attributes.u_normalTexture, 1);
   
        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.normalTexture);

    
        var worldViewProjectionMatrix = M4.multiply(this.modelMatrix,cameraMatrix);
        gl.uniformMatrix4fv(attributes.u_world, false, this.modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesBuffer.length / 3);
    }


}