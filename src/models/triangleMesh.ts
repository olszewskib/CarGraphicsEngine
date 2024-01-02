import { Vec3 } from "./vec3";
import { Vertex } from "./vertex";
import { Triangle } from "./triangle";
import { BezierSurface } from "./BezierSurface";

export class TriangleMesh {
    size: number;
    precision: number;
    triangles: Triangle[];
    surface: BezierSurface;

    constructor(precision: number, surface: BezierSurface, isSphere: boolean) {
        this.size = 1;
        this.precision = precision;
        this.triangles = [];
        this.surface = surface;
        this.construct(this.precision,isSphere);
    }

    construct(precision: number, isSphere: boolean) {
        if(isSphere) {
            this.constructSphere(precision);
        } else {
            this.constructBezier(precision);
        }
    }

    constructSphere(precision: number): void {
        this.triangles = [];
        this.precision = precision;
        var radius: number = 0.5;
        var edgeLenght: number = this.size/this.precision;

        for(let i=0; i<this.precision; i++) {
            for(let j=0; j<this.precision; j++) {

                // north west vertex
                var nwX = edgeLenght * j;
                var nwY = edgeLenght * i; 
                // south west vertex
                var swX = nwX
                var swY = edgeLenght * (i+1); 
                // south east vertex
                var soX = edgeLenght * (j+1);
                var soY = swY;
                // north east vertex
                var neX = soX;
                var neY = nwY;

                var p1 = new Vertex(nwX, nwY, this.surface.S(nwX,nwY));
                p1.setdU(this.surface.dU(nwX,nwY));
                p1.setdV(this.surface.dV(nwX,nwY));
                p1.setNormal(Vec3.getSphereNormal(p1,radius));
                p1.normal?.normalize();

                var p2 = new Vertex(swX, swY, this.surface.S(swX,swY));
                p2.setdU(this.surface.dU(swX,swY));
                p2.setdV(this.surface.dV(swX,swY));
                p2.setNormal(Vec3.getSphereNormal(p2,radius));
                p2.normal?.normalize();

                var p3 = new Vertex(soX, soY, this.surface.S(soX,soY));
                p3.setdU(this.surface.dU(soX,soY));
                p3.setdV(this.surface.dV(soX,soY));
                p3.setNormal(Vec3.getSphereNormal(p3,radius));
                p3.normal?.normalize();

                var tLow = new Triangle(p1,p2,p3);
                this.triangles.push(tLow);

                var p4 = new Vertex(nwX, nwY, this.surface.S(nwX,nwY));
                p4.setdU(this.surface.dU(nwX,nwY));
                p4.setdV(this.surface.dV(nwX,nwY));
                p4.setNormal(Vec3.getSphereNormal(p4,radius));
                p4.normal?.normalize();

                var p5 = new Vertex(neX, neY, this.surface.S(neX,neY));
                p5.setdU(this.surface.dU(neX,neY));
                p5.setdV(this.surface.dV(neX,neY));
                p5.setNormal(Vec3.getSphereNormal(p5,radius));
                p5.normal?.normalize();

                var p6 = new Vertex(soX, soY, this.surface.S(soX,soY));
                p6.setdU(this.surface.dU(soX,soY));
                p6.setdV(this.surface.dV(soX,soY));
                p6.setNormal(Vec3.getSphereNormal(p6,radius));
                p6.normal?.normalize();

                var tHigh = new Triangle(p4,p5,p6);
                this.triangles.push(tHigh);
            
            }
        }
    }

    constructBezier(precision: number): void {
        this.triangles = [];
        this.precision = precision;
        var edgeLenght: number = this.size/this.precision;

        for(let i=0; i<this.precision; i++) {
            for(let j=0; j<this.precision; j++) {

                // north west vertex
                var nwX = edgeLenght * j;
                var nwY = edgeLenght * i; 
                // south west vertex
                var swX = nwX
                var swY = edgeLenght * (i+1); 
                // south east vertex
                var soX = edgeLenght * (j+1);
                var soY = swY;
                // north east vertex
                var neX = soX;
                var neY = nwY;

                var p1 = new Vertex(nwX, nwY, this.surface.P(nwX,nwY));
                p1.setdU(this.surface.dU(nwX,nwY));
                p1.setdV(this.surface.dV(nwX,nwY));
                p1.setNormal(Vec3.crossProduct(p1.dU,p1.dV));
                p1.normal?.normalize();

                var p2 = new Vertex(swX, swY, this.surface.P(swX,swY));
                p2.setdU(this.surface.dU(swX,swY));
                p2.setdV(this.surface.dV(swX,swY));
                p2.setNormal(Vec3.crossProduct(p2.dU,p2.dV));
                p2.normal?.normalize();

                var p3 = new Vertex(soX, soY, this.surface.P(soX,soY));
                p3.setdU(this.surface.dU(soX,soY));
                p3.setdV(this.surface.dV(soX,soY));
                p3.setNormal(Vec3.crossProduct(p3.dU,p3.dV));
                p3.normal?.normalize();

                var tLow = new Triangle(p1,p2,p3);
                this.triangles.push(tLow);

                var p4 = new Vertex(nwX, nwY, this.surface.P(nwX,nwY));
                p4.setdU(this.surface.dU(nwX,nwY));
                p4.setdV(this.surface.dV(nwX,nwY));
                p4.setNormal(Vec3.crossProduct(p4.dU,p4.dV));
                p4.normal?.normalize();

                var p5 = new Vertex(neX, neY, this.surface.P(neX,neY));
                p5.setdU(this.surface.dU(neX,neY));
                p5.setdV(this.surface.dV(neX,neY));
                p5.setNormal(Vec3.crossProduct(p5.dU,p5.dV));
                p5.normal?.normalize();

                var p6 = new Vertex(soX, soY, this.surface.P(soX,soY));
                p6.setdU(this.surface.dU(soX,soY));
                p6.setdV(this.surface.dV(soX,soY));
                p6.setNormal(Vec3.crossProduct(p6.dU,p6.dV));
                p6.normal?.normalize();

                var tHigh = new Triangle(p4,p5,p6);
                this.triangles.push(tHigh);
            }
        }
    }
}

export function getNormals(mesh: TriangleMesh): Float32Array {

    var normals: number[] = new Array();

    mesh.triangles.forEach( triangle => {
        if(!triangle.p1.normal || !triangle.p2.normal || !triangle.p3.normal) {
            throw new Error("VertexNormalIsUndefined");
        }

        var p1 = triangle.p1.normal.getVec3ForBuffer();
        normals.push(...p1)
        var p2 = triangle.p2.normal.getVec3ForBuffer();
        normals.push(...p2)
        var p3 = triangle.p3.normal.getVec3ForBuffer();
        normals.push(...p3)
    })

    var cpuBuffer: Float32Array = new Float32Array(normals);
    return cpuBuffer;
}

export function getTangents(mesh: TriangleMesh): Float32Array {

    var tangents: number[] = new Array();

    mesh.triangles.forEach( triangle => {

        var p1 = triangle.p1.dU.getVec3ForBuffer();
        tangents.push(...p1)
        var p2 = triangle.p2.dU.getVec3ForBuffer();
        tangents.push(...p2)
        var p3 = triangle.p3.dU.getVec3ForBuffer();
        tangents.push(...p3)
    })

    var cpuBuffer: Float32Array = new Float32Array(tangents);
    return cpuBuffer;
}

export function getBiTangents(mesh: TriangleMesh): Float32Array {

    var bitangents: number[] = new Array();

    mesh.triangles.forEach( triangle => {

        var p1 = triangle.p1.dV.getVec3ForBuffer();
        bitangents.push(...p1)
        var p2 = triangle.p2.dV.getVec3ForBuffer();
        bitangents.push(...p2)
        var p3 = triangle.p3.dV.getVec3ForBuffer();
        bitangents.push(...p3)
    })

    var cpuBuffer: Float32Array = new Float32Array(bitangents);
    return cpuBuffer;
}
export function getColors(mesh: TriangleMesh, color?: Vec3): Uint8Array {
    
    var colors: number[] = new Array();
    for(let i:number = 0; i<mesh.triangles.length; i++) {

        if(typeof color == 'undefined') {
            colors.push(255,0,0);
            colors.push(0,255,0);
            colors.push(0,0,255);
        } else {
            colors.push(...color.getVec3ForBuffer());
            colors.push(...color.getVec3ForBuffer());
            colors.push(...color.getVec3ForBuffer());
        }

    }

    var cpuBuffer: Uint8Array = new Uint8Array(colors);
    return cpuBuffer;
}

export function getVertices(mesh: TriangleMesh): Float32Array {

    var vertices: number[] = new Array();

    mesh.triangles.forEach( triangle => {
        var p1 = triangle.p1.getVec3ForBuffer();
        vertices.push(...p1)
        var p2 = triangle.p2.getVec3ForBuffer();
        vertices.push(...p2)
        var p3 = triangle.p3.getVec3ForBuffer();
        vertices.push(...p3)
    })

    var cpuBuffer: Float32Array = new Float32Array(vertices);
    return cpuBuffer;
}

export function getTexture(mesh: TriangleMesh): Float32Array {

    var vertices: number[] = new Array();

    mesh.triangles.forEach( triangle => {

        var p1 = triangle.p1.getVec2ForBuffer();
        vertices.push(...p1)
        var p2 = triangle.p2.getVec2ForBuffer();
        vertices.push(...p2)
        var p3 = triangle.p3.getVec2ForBuffer();
        vertices.push(...p3)
    })

    var cpuBuffer: Float32Array = new Float32Array(vertices);
    return cpuBuffer;
}