import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { Vec3 } from "../math/vec3";




export function getCameraMatrix(canvas: HTMLCanvasElement, cameraPosition: Vec3, targetPosition: Vec3) : M4 {

    // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see 
    var projectionMatrix = M4.perspective(deg2rad(60),canvas.clientWidth/canvas.clientHeight,1,20000);

    // This matrix positions the camera in the u_world 
    var upVector: Vec3 = new Vec3(0,1,0); // this set the "up" direction of the u_world;
    var cameraMatrix = M4.pointAt(cameraPosition, targetPosition, upVector);
    
    // This matrix is responsible for moving object in the u_world in front of the camera, it is the inversion
    // of camera matrix this way we can obtain static camera effect
    var viewMatrix = cameraMatrix.inverse();
    
    // This matrix first moves the object in front of the camera <vievMatrix> and then clips it into space <projectionMatrix>
    var viewProjectionMatrix = M4.multiply(viewMatrix,projectionMatrix);

    return viewProjectionMatrix;
}