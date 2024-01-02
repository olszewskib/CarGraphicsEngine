import { Vec3 } from "./vec3";

export type Point3D = {
    x: number;
    y: number;
    z: number;
};

export class BezierSurface {
    readonly degree = 3;
    controlPoints: Point3D[][];

    constructor() {
        this.controlPoints = [];

        var x:number = 0;
        var y:number = 0;
        var z:number = 0;
        
        for(var i:number =0; i <= this.degree; i++) {
            this.controlPoints[i] = [];
            for(var j:number = 0; j <= this.degree; j++) {
                this.controlPoints[i][j] = {x: x, y: y, z: z};
                x+=(1/this.degree);
            }
            x=0;
            y+=(1/this.degree);
        }
    }

    setControlPointZValue(i: number, j: number, newZ: number) {
        this.controlPoints[i][j].z = newZ;
    }

    static B(t: number, i: number): number {
        switch(i) {
            case 0:
                return (1-t) * (1-t) * (1-t);
            case 1:
                return 3 * (1-t) * (1-t) * t;
            case 2:
                return 3 * (1-t) * t * t;
            case 3:
                return t * t * t;
            default:
                return 0;
        }
    }

    P(u: number, v: number): number {
        var result:number = 0;

        for(let i:number = 0; i<=this.degree; i++) {
            for(let j:number = 0; j<=this.degree; j++) {
                result += BezierSurface.B(u,i) * BezierSurface.B(v,j) * this.controlPoints[i][j].z;
            }
        }
        return result;
    }

    S(u: number, v: number): number {
        var radius: number = 0.5;
        var xMiddle: number = 0.5;
        var yMiddle: number = 0.5;

        if( Math.sqrt( (xMiddle-u) * (xMiddle-u) + (yMiddle-v) * (yMiddle-v)) >= 0.5 ) return 0;

        return Math.sqrt(radius * radius - (u - xMiddle) * (u - xMiddle) - (v - yMiddle) * (v - yMiddle));
    }

    static bezierCurve(points: Vec3[], t: number): Vec3 {
        var result:Vec3 = new Vec3();
        for(let i:number = 0; i<4; i++) {
            result.add(Vec3.scale(points[i],BezierSurface.B(t,i)));
        }
        return result;   
    }

    dU(u: number, v:number): Vec3 {
        var points: Vec3[] = [];
        var curve: Vec3[] = [];

        for(let i:number = 0; i<=this.degree; i++) {
            var v0:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[0][i]);
            var v1:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[1][i]);
            var v2:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[2][i]);
            var v3:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[3][i]);
            points.push(v0,v1,v2,v3);

            curve[i] = BezierSurface.bezierCurve(points,v);
            points = [];
        }

        var result:Vec3 = new Vec3();

        result.add(Vec3.scale(curve[0],-3 * (1 - u) * (1 - u)));
        result.add(Vec3.scale(curve[1],3 * (1 - u) * (1 - u) - 6 * u * (1 - u)));
        result.add(Vec3.scale(curve[2],6 * u * (1 - u) - 3 * u * u));
        result.add(Vec3.scale(curve[3],3 * u * u));

        return result;
    }
    
    dV(u: number, v:number): Vec3 {
        var points: Vec3[] = [];
        var curve: Vec3[] = [];

        for(let i:number = 0; i<=this.degree; i++) {
            var v0:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[i][0]);
            var v1:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[i][1]);
            var v2:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[i][2]);
            var v3:Vec3 = Vec3.convertFromPoint3D(this.controlPoints[i][3]);
            points.push(v0,v1,v2,v3);

            curve[i] = BezierSurface.bezierCurve(points,u);
            points = [];
        }

        var result:Vec3 = new Vec3();

        result.add(Vec3.scale(curve[0],-3 * (1 - v) * (1 - v)));
        result.add(Vec3.scale(curve[1],3 * (1 - v) * (1 - v) - 6 * v * (1 - v)));
        result.add(Vec3.scale(curve[2],6 * v * (1 - v) - 3 * v * v));
        result.add(Vec3.scale(curve[3],3 * v * v));

        return result;
    }
}