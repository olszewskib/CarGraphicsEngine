import { Car } from "../car/car";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { Quaternion } from "../math/quaternion";
import { Vec3 } from "../math/vec3";

export function getCameraMatrix(width:number, height:number, cameraPosition: Vec3, targetPosition: Vec3) : M4 {

    // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see 
    var projectionMatrix = M4.perspective(deg2rad(60),width/height,1,20000);

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

export class Camera {
    position: Vec3;
    target: Vec3;
    upVector: Vec3;
    matrix: M4;
    width: number;
    height: number;

    constructor(position: Vec3, target: Vec3, width: number, height: number) {
        this.position = position;
        this.target = target;
        this.width = width;
        this.height = height;
        this.upVector = new Vec3(0,1,0);
        this.matrix = new M4();
        this.updateMatrix();
    }

    updateMatrix(): void {

        // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see
        var ratio = this.width / this.height;
        var projectionMatrix = M4.perspective(deg2rad(60), ratio, 1, 5000);

        // This matrix positions the camera in the u_world 
        var cameraMatrix = M4.pointAt(this.position, this.target, this.upVector);
        
        // This matrix is responsible for moving object in the u_world in front of the camera, it is the inversion
        // of camera matrix this way we can obtain static camera effect
        var viewMatrix = cameraMatrix.inverse();
        
        // This matrix first moves the object in front of the camera <vievMatrix> and then clips it into space <projectionMatrix>
        var viewProjectionMatrix = M4.multiply(viewMatrix,projectionMatrix);

        this.matrix = viewProjectionMatrix;

    }

    static (): void {
        this.upVector = new Vec3(0,1,0);
        this.target = new Vec3(491,45,345);
        this.updateMatrix();
    }

    staticFollowCar(carPosition: Vec3, carRotation: number): void {
        this.upVector = new Vec3(0,1,0);
        this.position = new Vec3(491,-2965,3212);
        this.target = carPosition;
        this.updateMatrix();
    }

    followCar(car: Car): void {
        // Create a quaternion from the car's rotation (yaw)
        var quaternion = Quaternion.fromEuler(0, deg2rad(car.rotation), 0);

        // Calculate the direction vector from the camera to the car
        var direction = Vec3.subtract(car.currentPosition, this.position);

        // Rotate the direction vector using the quaternion
        // This makes the camera "look at" the car
        this.target = Vec3.sum(this.position, quaternion.rotateVector(direction));

        // Calculate the up vector based on the quaternion
        this.upVector = quaternion.rotateVector(new Vec3(0, 1, 0));

        // Update the camera matrix (assuming updateMatrix method exists)
        this.updateMatrix();
    }

    gameCamera(car: Car) {
        this.upVector = new Vec3(0,-1,0);
        this.position = new Vec3(491,1000,400);
        this.target = new Vec3(491,-400,0);
        this.updateMatrix();
    }

}