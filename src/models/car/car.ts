import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { CarLight } from "../lights/carLight";
import { Vec3 } from "../math/vec3";
import { ObjModel } from "../objModel";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { ILight } from "../lights/light";
import { Camera } from "../camera/camera";
import { IRenderObject } from "../renderObject";

export class Car implements IRenderObject {
    
    model: ObjModel;
    modelMatrix: M4;
    currentPosition: Vec3 = new Vec3(0,0,0);
    back: Vec3 = new Vec3(500,1000,350);
    front: Vec3 = new Vec3(500,-200,100);
    rotation: number = 0
    readonly worldLights: ILight[];
    readonly carLights: CarLight[];
    camera: Camera;

    constructor(model: ObjModel, worldLights: ILight[], lights: CarLight[], camera: Camera) {
        this.model = model;
        this.worldLights = worldLights;
        this.carLights = lights;
        this.camera = camera;
        this.modelMatrix = new M4();
        this.setInitialModelMatrix();
    }

     setInitialModelMatrix() {
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

        this.back = this.carLights[2].getPosition();
        this.back.v3 += 100;
        this.front = this.carLights[1].getPosition();
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

    draw(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes) {
        
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
   
        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.model.normalTexture);
    
        var worldViewProjectionMatrix = M4.multiply(this.modelMatrix,this.camera.matrix);
        gl.uniformMatrix4fv(attributes.u_world, false, this.modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.model.verticesBuffer.length / 3);
    }


}