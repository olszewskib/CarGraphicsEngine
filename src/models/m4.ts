import { Vec3 } from "./vec3";

export class M4 {
    readonly degree = 4;
    values: number[][];
    
    constructor() {
        this.values = [];
        for(var i:number =0; i < this.degree; i++) {
            this.values[i] = [];
            for(var j:number = 0; j < this.degree; j++) {
                this.values[i][j] = 0;
            }
        }
    }

    static translation(dx: number,dy: number,dz: number): M4 {
        var transaltionMatrix = new M4();

        transaltionMatrix.values[0][0] = 1;
        transaltionMatrix.values[1][1] = 1;
        transaltionMatrix.values[2][2] = 1;
        transaltionMatrix.values[3][3] = 1;
        
        transaltionMatrix.values[3][0] = dx;
        transaltionMatrix.values[3][1] = dy;
        transaltionMatrix.values[3][2] = dz;

        return transaltionMatrix;
    }

    static rotationX(rad: number): M4 {
        var rotationMatrix = new M4();
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        rotationMatrix.values[0][0] = 1;

        rotationMatrix.values[1][1] = c;
        rotationMatrix.values[1][2] = s;

        rotationMatrix.values[2][1] = -s;
        rotationMatrix.values[2][2] = c;

        rotationMatrix.values[3][3] = 1;

        return rotationMatrix
    }

    static rotationY(rad: number): M4 {
        var rotationMatrix = new M4();
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        rotationMatrix.values[0][0] = c;
        rotationMatrix.values[0][2] = -s;

        rotationMatrix.values[1][1] = 1;

        rotationMatrix.values[2][0] = s;
        rotationMatrix.values[2][2] = c;

        rotationMatrix.values[3][3] = 1;

        return rotationMatrix
    }

    static rotationZ(rad: number): M4 {
        var rotationMatrix = new M4();
        var s = Math.sin(rad);
        var c = Math.cos(rad);

        rotationMatrix.values[0][0] = c;
        rotationMatrix.values[0][1] = s;

        rotationMatrix.values[1][0] = -s;
        rotationMatrix.values[1][1] = c;

        rotationMatrix.values[2][2] = 1;

        rotationMatrix.values[3][3] = 1;

        return rotationMatrix
    }

    static scaling(sx: number, sy: number, sz: number): M4 {
        var scaledMatrix = new M4();
        
        scaledMatrix.values[0][0] = sx;
        scaledMatrix.values[1][1] = sy;
        scaledMatrix.values[2][2] = sz;
        scaledMatrix.values[3][3] = 1;

        return scaledMatrix;
    }

    static multiply(A: M4, B: M4): M4 {
        var a = A.values;
        var b = B.values;
        var result = new M4();

        result.values[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0] + a[0][3] * b[3][0];
        result.values[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1] + a[0][3] * b[3][1];
        result.values[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2] + a[0][3] * b[3][2];
        result.values[0][3] = a[0][0] * b[0][3] + a[0][1] * b[1][3] + a[0][2] * b[2][3] + a[0][3] * b[3][3];

        result.values[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0] + a[1][3] * b[3][0];
        result.values[1][1] = a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1] + a[1][3] * b[3][1];
        result.values[1][2] = a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2] + a[1][3] * b[3][2];
        result.values[1][3] = a[1][0] * b[0][3] + a[1][1] * b[1][3] + a[1][2] * b[2][3] + a[1][3] * b[3][3];

        result.values[2][0] = a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0] + a[2][3] * b[3][0];
        result.values[2][1] = a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1] + a[2][3] * b[3][1];
        result.values[2][2] = a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2] + a[2][3] * b[3][2];
        result.values[2][3] = a[2][0] * b[0][3] + a[2][1] * b[1][3] + a[2][2] * b[2][3] + a[2][3] * b[3][3];

        result.values[3][0] = a[3][0] * b[0][0] + a[3][1] * b[1][0] + a[3][2] * b[2][0] + a[3][3] * b[3][0];
        result.values[3][1] = a[3][0] * b[0][1] + a[3][1] * b[1][1] + a[3][2] * b[2][1] + a[3][3] * b[3][1];
        result.values[3][2] = a[3][0] * b[0][2] + a[3][1] * b[1][2] + a[3][2] * b[2][2] + a[3][3] * b[3][2];
        result.values[3][3] = a[3][0] * b[0][3] + a[3][1] * b[1][3] + a[3][2] * b[2][3] + a[3][3] * b[3][3];

        return result;
    }

    static project(w: number, h: number, d: number): M4 {
        var result = new M4();

        result.values[0][0] = 2/w;
        result.values[1][1] = -2/h;
        result.values[2][2] = 2/d;
        result.values[3][0] = -1;
        result.values[3][1] = 1;
        result.values[3][3] = 1;

        return result;
    }

    static pointAt(camera: Vec3, target: Vec3, upVec: Vec3 ): M4 {
        var zAxis: Vec3 = Vec3.subtractVectors(camera,target);
        zAxis.normalize();

        var xAxis: Vec3 = Vec3.crossProduct(upVec,zAxis);
        xAxis.normalize();

        var yAxis: Vec3 = Vec3.crossProduct(zAxis,xAxis);
        yAxis.normalize();

        var result = new M4();

        result.values[0][0] = xAxis.v1;
        result.values[0][1] = xAxis.v2;
        result.values[0][2] = xAxis.v3;
        result.values[0][3] = 0;

        result.values[1][0] = yAxis.v1;
        result.values[1][1] = yAxis.v2;
        result.values[1][2] = yAxis.v3;
        result.values[1][3] = 0;

        result.values[2][0] = zAxis.v1;
        result.values[2][1] = zAxis.v2;
        result.values[2][2] = zAxis.v3;
        result.values[2][3] = 0;

        result.values[3][0] = camera.v1;
        result.values[3][1] = camera.v2;
        result.values[3][2] = camera.v3;
        result.values[3][3] = 1;

        return result;
    }

    static perspective(fowRAD: number, aspect: number, zNear: number, zFar: number): M4 {
        // aspect: clientWidth / clientHeight
        var result = new M4();
        var fow = Math.tan(Math.PI * 0.5 - 0.5 * fowRAD);
        var range = 1.0 / (zNear - zFar);

        result.values[0][0] = fow/aspect;
        result.values[1][1] = fow;
        result.values[2][2] = (zNear * zFar)*range;
        result.values[2][3] = -1;
        result.values[3][2] = zNear * zFar * range * 2;

        return result;
    }

    inverse(): M4 {
        // https://semath.info/src/inverse-cofactor-ex4.html

        var adj = new M4();
        var a = this.values;

        adj.values[0][0] = a[1][1]*a[2][2]*a[3][3] + a[1][2]*a[2][3]*a[3][1] + a[1][3]*a[2][1]*a[3][2] - a[1][3]*a[2][2]*a[3][1] - a[1][2]*a[2][1]*a[3][3] - a[1][1]*a[2][3]*a[3][2];
        adj.values[0][1] = - a[0][1]*a[2][2]*a[3][3] - a[0][2]*a[2][3]*a[3][1] - a[0][3]*a[2][1]*a[3][2] + a[0][3]*a[2][2]*a[3][1] + a[0][2]*a[2][1]*a[3][3] + a[0][1]*a[2][3]*a[3][2];
        adj.values[0][2] = a[0][1]*a[1][2]*a[3][3] + a[0][2]*a[1][3]*a[3][1] + a[0][3]*a[1][1]*a[3][2] - a[0][3]*a[1][2]*a[3][1] - a[0][2]*a[1][1]*a[3][3] - a[0][1]*a[1][3]*a[3][2];
        adj.values[0][3] = - a[0][1]*a[1][2]*a[2][3] - a[0][2]*a[1][3]*a[2][1] - a[0][3]*a[1][1]*a[2][2] + a[0][3]*a[1][2]*a[2][1] + a[0][2]*a[1][1]*a[2][3] + a[0][1]*a[1][3]*a[2][2];

        adj.values[1][0] = - a[1][0]*a[2][2]*a[3][3] - a[1][2]*a[2][3]*a[3][0] - a[1][3]*a[2][0]*a[3][2] + a[1][3]*a[2][2]*a[3][0] + a[1][2]*a[2][0]*a[3][3] + a[1][0]*a[2][3]*a[3][2];
        adj.values[1][1] = a[0][0]*a[2][2]*a[3][3] + a[0][2]*a[2][3]*a[3][0] + a[0][3]*a[2][0]*a[3][2] - a[0][3]*a[2][2]*a[3][0] - a[0][2]*a[2][0]*a[3][3] - a[0][0]*a[2][3]*a[3][2];
        adj.values[1][2] = - a[0][0]*a[1][2]*a[3][3] - a[0][2]*a[1][3]*a[3][0] - a[0][3]*a[1][0]*a[3][2] + a[0][3]*a[1][2]*a[3][0] + a[0][2]*a[1][0]*a[3][3] + a[0][0]*a[1][3]*a[3][2];
        adj.values[1][3] = a[0][0]*a[1][2]*a[2][3] + a[0][2]*a[1][3]*a[2][0] + a[0][3]*a[1][0]*a[2][2] - a[0][3]*a[1][2]*a[2][0] - a[0][2]*a[1][0]*a[2][3] - a[0][0]*a[1][3]*a[2][2];

        adj.values[2][0] = a[1][0]*a[2][1]*a[3][3] + a[1][1]*a[2][3]*a[3][0] + a[1][3]*a[2][0]*a[3][1] - a[1][3]*a[2][1]*a[3][0] - a[1][1]*a[2][0]*a[3][3] - a[1][0]*a[2][3]*a[3][1];
        adj.values[2][1] = - a[0][0]*a[2][1]*a[3][3] - a[0][1]*a[2][3]*a[3][0] - a[0][3]*a[2][0]*a[3][1] + a[0][3]*a[2][1]*a[3][0] + a[0][1]*a[2][0]*a[3][3] + a[0][0]*a[2][3]*a[3][1];
        adj.values[2][2] = a[0][0]*a[1][1]*a[3][3] + a[0][1]*a[1][3]*a[3][0] + a[0][3]*a[1][0]*a[3][1] - a[0][3]*a[1][1]*a[3][0] - a[0][1]*a[1][0]*a[3][3] - a[0][0]*a[1][3]*a[3][1];
        adj.values[2][3] = - a[0][0]*a[1][1]*a[2][3] - a[0][1]*a[1][3]*a[2][0] - a[0][3]*a[1][0]*a[2][1] + a[0][3]*a[1][1]*a[2][0] + a[0][1]*a[1][0]*a[2][3] + a[0][0]*a[1][3]*a[2][1];

        adj.values[3][0] = - a[1][0]*a[2][1]*a[3][2] - a[1][1]*a[2][2]*a[3][0] - a[1][2]*a[2][0]*a[3][1] + a[1][2]*a[2][1]*a[3][0] + a[1][1]*a[2][0]*a[3][2] + a[1][0]*a[2][2]*a[3][1];
        adj.values[3][1] = a[0][0]*a[2][1]*a[3][2] + a[0][1]*a[2][2]*a[3][0] + a[0][2]*a[2][0]*a[3][1] - a[0][2]*a[2][1]*a[3][0] - a[0][1]*a[2][0]*a[3][2] - a[0][0]*a[2][2]*a[3][1];
        adj.values[3][2] = - a[0][0]*a[1][1]*a[3][2] - a[0][1]*a[1][2]*a[3][0] - a[0][2]*a[1][0]*a[3][1] + a[0][2]*a[1][1]*a[3][0] + a[0][1]*a[1][0]*a[3][2] + a[0][0]*a[1][2]*a[3][1];
        adj.values[3][3] = a[0][0]*a[1][1]*a[2][2] + a[0][1]*a[1][2]*a[2][0] + a[0][2]*a[1][0]*a[2][1] - a[0][2]*a[1][1]*a[2][0] - a[0][1]*a[1][0]*a[2][2] - a[0][0]*a[1][2]*a[2][1];

        var det = a[0][0] * adj.values[0][0] + a[1][0] * adj.values[0][1] + a[2][0] * adj.values[0][2] + a[3][0] * adj.values[0][3];

        for(var i:number =0; i < this.degree; i++) {
            for(var j:number = 0; j < this.degree; j++) {
                adj.values[i][j] /= det;
            }
        }

        return adj;
    }

    transpose(): M4 {
        var result = new M4();

        result.values[0][0] = this.values [0][0];
        result.values[0][1] = this.values [1][0];
        result.values[0][2] = this.values [2][0];
        result.values[0][3] = this.values [3][0];

        result.values[1][0] = this.values [0][1];
        result.values[1][1] = this.values [1][1];
        result.values[1][2] = this.values [2][1];
        result.values[1][3] = this.values [3][1];

        result.values[2][0] = this.values [0][2];
        result.values[2][1] = this.values [1][2];
        result.values[2][2] = this.values [2][2];
        result.values[2][3] = this.values [3][2];

        result.values[3][0] = this.values [0][3];
        result.values[3][1] = this.values [1][3];
        result.values[3][2] = this.values [2][3];
        result.values[3][3] = this.values [3][3];

        return result;
    }

    convert(): number[] {
        var result = [];
        for(var i:number =0; i < this.degree; i++) {
            for(var j:number = 0; j < this.degree; j++) {
                result.push(this.values[i][j]);
            }
        }
        return result;
    }
}