import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { Vec3 } from "../math/vec3";

export function drawLights(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, bufferData: Float32Array, modelMatrix: M4, cameraMatrix: M4) {
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.a_vertex);
    gl.enableVertexAttribArray(attributes.a_color);

    var rgb = [];
    for(var i = 0; i < bufferData.length; i+=9) {
        rgb.push(...[255,255,0]);
        rgb.push(...[255,255,0]);
        rgb.push(...[255,255,0]);
    }

    var vertexBuffer = createStaticVertexBuffer(gl, bufferData);
    var colorBuffer = createStaticVertexBuffer(gl, new Uint8Array(rgb));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
 
    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
    gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, bufferData.length / 3);
}


export function getRightLightData() {
    
    var lightLocation = new Vec3(376,157,128);

    var modelMatrix = M4.scaling(24,15,43);
    var xRotationMatrix = M4.rotationX(deg2rad(118));
    var yRotationMatrix = M4.rotationY(deg2rad(186));
    var zRotationMatrix = M4.rotationZ(deg2rad(0));
    var translationMatrix = M4.translation(lightLocation.v1,lightLocation.v2,lightLocation.v3);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,yRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    
    return {
        modelMatrix,
        lightLocation,
    }
}

export function getLeftLightData() {

    var lightLocation = new Vec3(626,144,127);

    var modelMatrix = M4.scaling(28,12,41);
    var xRotationMatrix = M4.rotationX(deg2rad(121));
    var yRotationMatrix = M4.rotationY(deg2rad(360));
    var zRotationMatrix = M4.rotationZ(deg2rad(176));
    var translationMatrix = M4.translation(lightLocation.v1,lightLocation.v2,lightLocation.v3);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,yRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    
    return {
        modelMatrix,
        lightLocation,
    }

}