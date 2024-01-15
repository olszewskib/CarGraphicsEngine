import { Vec3 } from "../math/vec3";
import { Vertex } from "./vertex";
import { Triangle } from "./triangle";
import { BezierSurfaceModel } from "./BezierSurfaceModel";
import { GlAttributes, createStaticVertexBuffer } from "../../webGL";
import { deg2rad } from "../math/angles";
import { M4 } from "../math/m4";
import { CarLight } from "../lights/carLight";

export class BezierSurface {
    size: number;
    precision: number;
    triangles: Triangle[];
    surface: BezierSurfaceModel;

    verticesBuffer: Float32Array;
    normalsBuffer: Float32Array;
    textureBuffer: Float32Array;
    tangentsBuffer: Float32Array;
    colorsBuffer: Uint8Array;
    texture: WebGLTexture;
    normalTexture: WebGLTexture;
    mirror: number;
    ks: number;
    kd: number;

    modelMatrix: M4;

    // TODO: waiting for refactor
    mainLight: Vec3;
    carLights: CarLight[];


    constructor(precision: number, surface: BezierSurfaceModel, mainLight: Vec3, carLights: CarLight[], texture: WebGLTexture, normalTexture: WebGLTexture, mirror: number, ks: number, kd: number) {
        this.size = 1;
        this.precision = precision;
        this.triangles = [];
        this.surface = surface;

        // buffers
        this.verticesBuffer = new Float32Array();
        this.normalsBuffer = new Float32Array();
        this.textureBuffer = new Float32Array();
        this.tangentsBuffer = new Float32Array();
        this.colorsBuffer = new Uint8Array();
        this.texture = texture;
        this.normalTexture = normalTexture;
        this.mirror = mirror;
        this.ks = ks;
        this.kd = kd;

        this.modelMatrix = new M4();

        // TODO: waiting for refactor
        this.mainLight = mainLight;
        this.carLights = carLights;

        this.setInitialModelMatrix();
        this.construct(this.precision);
    }

    private setInitialModelMatrix(): void {
        var modelMatrix = M4.scaling(1000,500,200);
        var rotationMatrix = M4.rotationX(deg2rad(90));
        modelMatrix = M4.multiply(modelMatrix,rotationMatrix);
        this.modelMatrix = modelMatrix;
    }


    move(transformationMatrix: M4): void {
        this.modelMatrix = M4.multiply(this.modelMatrix,transformationMatrix);
    }

    construct(precision: number): void {
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

        this.verticesBuffer = getVertices(this);
        this.normalsBuffer = getNormals(this);
        this.textureBuffer = getTexture(this);
        this.tangentsBuffer = getTangents(this);
        this.colorsBuffer = getColors(this);
    }

    draw(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3) {
    
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(attributes.a_vertex);
        gl.enableVertexAttribArray(attributes.a_color);
        gl.enableVertexAttribArray(attributes.a_normal);
        gl.enableVertexAttribArray(attributes.a_texcoord);
        gl.enableVertexAttribArray(attributes.a_tangent);

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
        gl.uniform1f(attributes.u_m,this.mirror)
        gl.uniform1f(attributes.u_ks,this.ks);
        gl.uniform1f(attributes.u_kd,this.kd);
        gl.uniform1f(attributes.u_kc,1.0);
        gl.uniform1f(attributes.u_kl,0.09);
        gl.uniform1f(attributes.u_kq,0.032);
        gl.uniform1i(attributes.u_texture, 0);
        gl.uniform1i(attributes.u_normalTexture, 1);

        var triangleBuffer = createStaticVertexBuffer(gl, this.verticesBuffer);
        var rgbTriabgleBuffer = createStaticVertexBuffer(gl, this.colorsBuffer);
        var normalsBuffer = createStaticVertexBuffer(gl, this.normalsBuffer);
        var tangentsBuffer = createStaticVertexBuffer(gl, this.tangentsBuffer);
        var textureBuffer = createStaticVertexBuffer(gl, this.textureBuffer);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.vertexAttribPointer(attributes.a_normal, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriabgleBuffer);
        gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, tangentsBuffer);
        gl.vertexAttribPointer(attributes.a_tangent, 3, gl.FLOAT, false, 0, 0);
    
        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, this.normalTexture);
    
    
        var worldViewProjectionMatrix = M4.multiply(this.modelMatrix,cameraMatrix);
    
        gl.uniformMatrix4fv(attributes.u_world, false, this.modelMatrix.convert());
        gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());
    
        gl.drawArrays(gl.TRIANGLES, 0, this.verticesBuffer.length / 3);
    }

    liftEdge(index: number, height: number): void {
        this.surface.setControlPointZValue(0,index,height);
        this.surface.setControlPointZValue(1,index,height);
        this.surface.setControlPointZValue(2,index,height);
        this.surface.setControlPointZValue(3,index,height);
    }
}

export function getNormals(mesh: BezierSurface): Float32Array {

    var normals: number[] = new Array();

    mesh.triangles.forEach( triangle => {
        if(!triangle.p1.normal || !triangle.p2.normal || !triangle.p3.normal) {
            throw new Error("a_normalIsUndefined");
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

export function getTangents(mesh: BezierSurface): Float32Array {

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

export function getBiTangents(mesh: BezierSurface): Float32Array {

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

export function getColors(mesh: BezierSurface, color?: Vec3): Uint8Array {
    
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

export function getVertices(mesh: BezierSurface): Float32Array {

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

export function getTexture(mesh: BezierSurface): Float32Array {

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