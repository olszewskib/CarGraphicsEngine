import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { Vec3 } from "../math/vec3";
import { CarLightModel } from "./carLightModel";

export class CarLight {
    location: Vec3;
    scale: Vec3;
    rotation: Vec3;
    color: Vec3;
    model: CarLightModel;

    constructor(location: Vec3, rotation: Vec3, scale: Vec3, color: Vec3, model: CarLightModel) {
        this.location = new Vec3(location.v1,location.v2,location.v3);
        this.scale = new Vec3(scale.v1,scale.v2,scale.v3);
        this.rotation = new Vec3(rotation.v1,rotation.v2,rotation.v3);
        this.color = new Vec3(color.v1,color.v2,color.v3);
        this.model = model;
    }

    getModelMatrix(): M4 {

        var modelMatrix = M4.scaling(this.scale.v1,this.scale.v2,this.scale.v3);
        var xRotationMatrix = M4.rotationX(deg2rad(this.rotation.v1));
        var yRotationMatrix = M4.rotationY(deg2rad(this.rotation.v2));
        var zRotationMatrix = M4.rotationZ(deg2rad(this.rotation.v3));
        var translationMatrix = M4.translation(this.location.v1,this.location.v2,this.location.v3);
        modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,yRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
        modelMatrix = M4.multiply(modelMatrix,translationMatrix);
        
        return modelMatrix;
    }
    
    draw(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4) {
    
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.a_vertex);
    gl.enableVertexAttribArray(attributes.a_color);

    var rgb = [];
    for(var i = 0; i < this.model.bufferData.length; i+=9) {
        rgb.push(...this.color.getVec3ForBuffer());
        rgb.push(...this.color.getVec3ForBuffer());
        rgb.push(...this.color.getVec3ForBuffer());
    }

    var vertexBuffer = createStaticVertexBuffer(gl, this.model.bufferData);
    var colorBuffer = createStaticVertexBuffer(gl, new Uint8Array(rgb));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
 
    var worldViewProjectionMatrix = M4.multiply( this.getModelMatrix() ,cameraMatrix);
    gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, this.model.bufferData.length / 3);
}

}