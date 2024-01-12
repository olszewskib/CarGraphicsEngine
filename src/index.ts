import { BezierSurfaceModel } from "./models/bezier/BezierSurfaceModel";
import { bezierFragmentShaderSourceCode } from "./lib/bezier/fragmentShader";
import { bezierVertexShaderSourceCode } from "./lib/bezier/vertexShader";
import { carFragmentShader } from "./lib/car/carFragmentShader";
import { carVertexShader } from "./lib/car/carVertexShader";
import { M4 } from "./models/math/m4";
import { deg2rad } from "./models/math/angles";
import { Vec3 } from "./models/math/vec3";
import { BezierSurface, getColors, getNormals, getTangents, getTexture, getVertices } from "./models/bezier/BezierSurface";
import { createStaticVertexBuffer, getProgram } from "./webGL";
import { OBJParser } from "./objParser";

// ------------------------------------------------------------------------- Fetchin obj -------------------------------------------------------------------------
const objFileUrl = 'resources/obj/porsche/Porsche_911_GT2.obj';
//const objFileUrl = 'resources/drp.obj';
var carModel = new OBJParser();

await fetch(objFileUrl)
  .then(response => response.text())
  .then(objContent => {
    carModel.parse(objContent);
  })
  .catch(error => {
    console.error('Error fetching the OBJ file:', error);
  });
console.log('loaded');
// ------------------------------------------------------------------------- Fetchin obj -------------------------------------------------------------------------

const precisionSlider = document.getElementById("precisionSlider") as HTMLInputElement;

const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

if(precisionSlider == null || zSlider == null)
    throw new Error("slider not found");

precisionSlider.addEventListener("input", function() {
    precision = parseInt(precisionSlider.value,10);
    surface.construct(precision);
    triangleVertices = getVertices(surface);
    triangleNormals = getNormals(surface);
    triangleTangents = getTangents(surface);
    rgbTriangleColors = getColors(surface,meshColorVector);
    textureCoords = getTexture(surface);
    drawScene(0,true);
});

zSlider.addEventListener("input", function() {

    surfaceModel.setControlPointZValue(parseInt(xIndex.value,10),parseInt(yIndex.value,10),parseFloat(zSlider.value));

    var index = xIndex.value + yIndex.value;
    const cell = document.getElementById(index);
    if(cell) {
        if(zSlider.value == "0") {
            cell.textContent = "0.0";
        } else {
            cell.textContent = zSlider.value;
        }
    }
    surface.construct(precision);
    triangleVertices = getVertices(surface);
    triangleNormals = getNormals(surface);
    triangleTangents = getTangents(surface);
    rgbTriangleColors = getColors(surface,meshColorVector);
    drawScene(0,true)
    
})

//Camera position UI
const xCameraSlider = document.getElementById("xCamera") as HTMLInputElement;
const yCameraSlider = document.getElementById("yCamera") as HTMLInputElement;
const zCameraSlider = document.getElementById("zCamera") as HTMLInputElement;
if(xCameraSlider == null || yCameraSlider == null || zCameraSlider == null) {
    throw new Error("CameraSlidersError");
}

var xCamera: number = parseInt(xCameraSlider.value,10);
var yCamera: number = parseInt(yCameraSlider.value,10);
var zCamera: number = parseInt(zCameraSlider.value,10);

xCameraSlider.addEventListener("input", function() {
    xCamera = parseInt(xCameraSlider.value,10);
    drawScene(0,true);
});
yCameraSlider.addEventListener("input", function() {
    yCamera = parseInt(yCameraSlider.value,10);
    drawScene(0,true);
});
zCameraSlider.addEventListener("input", function() {
    zCamera = parseInt(zCameraSlider.value,10);
    drawScene(0,true);
});

//Camera direction UI
const xCameraDirectionSlider = document.getElementById("xCameraDirection") as HTMLInputElement;
const yCameraDirectionSlider = document.getElementById("yCameraDirection") as HTMLInputElement;
const zCameraDirectionSlider = document.getElementById("zCameraDirection") as HTMLInputElement;
if(xCameraDirectionSlider == null || yCameraDirectionSlider == null || zCameraDirectionSlider == null) {
    throw new Error("CameraSlidersError");
}

var xCameraDirection: number = parseInt(xCameraDirectionSlider.value,10);
var yCameraDirection: number = parseInt(yCameraDirectionSlider.value,10);
var zCameraDirection: number = parseInt(zCameraDirectionSlider.value,10);

xCameraDirectionSlider.addEventListener("input", function() {
    xCameraDirection = parseInt(xCameraDirectionSlider.value,10);
    drawScene(0,true);
});
yCameraDirectionSlider.addEventListener("input", function() {
    yCameraDirection = parseInt(yCameraDirectionSlider.value,10);
    drawScene(0,true);
});
zCameraDirectionSlider.addEventListener("input", function() {
    zCameraDirection = parseInt(zCameraDirectionSlider.value,10);
    drawScene(0,true);
});

// Light location UI
const xLightLocationSlider = document.getElementById("xLightLocation") as HTMLInputElement;
const yLightLocationSlider = document.getElementById("yLightLocation") as HTMLInputElement;
const zLightLocationSlider = document.getElementById("zLightLocation") as HTMLInputElement;
if(xLightLocationSlider == null || yLightLocationSlider == null || zLightLocationSlider == null) {
    throw new Error("CameraSlidersError");
}

var xLightLocation: number = parseInt(xLightLocationSlider.value,10);
var yLightLocation: number = parseInt(yLightLocationSlider.value,10);
var zLightLocation: number = parseInt(zLightLocationSlider.value,10);

xLightLocationSlider.addEventListener("input", function() {
    lightLocation.v1 = parseInt(xLightLocationSlider.value,10);
    drawScene(0,true);
});
yLightLocationSlider.addEventListener("input", function() {
    lightLocation.v2 = parseInt(yLightLocationSlider.value,10);
    drawScene(0,true);
});
zLightLocationSlider.addEventListener("input", function() {
    lightLocation.v3 = parseInt(zLightLocationSlider.value,10);
    drawScene(0,true);
});

// Mods UI
var kdSlider = document.getElementById("Kd") as HTMLInputElement;
var ksSlider = document.getElementById("Ks") as HTMLInputElement;
const mirrorSlider = document.getElementById("mirror") as HTMLInputElement;
if(ksSlider == null || kdSlider == null || mirrorSlider == null) {
    throw new Error("k(d/s)error");   
}

var kd = parseFloat(kdSlider.value);
var ks = parseFloat(ksSlider.value);
var mirror: number = parseInt(mirrorSlider.value,10);

kdSlider.addEventListener("input", function() {
    kd = parseFloat(kdSlider.value);
    drawScene(0,true);
})
ksSlider.addEventListener("input", function() {
    ks = parseFloat(ksSlider.value);
    drawScene(0,true);
})
mirrorSlider.addEventListener("input", function() {
    mirror = parseInt(mirrorSlider.value,10);
    drawScene(0,true);
})

// Colors UI
const lightColorPicker = document.getElementById("u_lightColor") as HTMLInputElement;
const meshColorPicker = document.getElementById("meshColor") as HTMLInputElement;
if(lightColorPicker == null || meshColorPicker == null) {
    throw new Error("colorpicker");
}

var lightColorVector: Vec3 = Vec3.convertFromHEX(lightColorPicker.value,true);
var meshColorVector: Vec3 = Vec3.convertFromHEX(meshColorPicker.value);

lightColorPicker.addEventListener("input", function() {
    lightColorVector = Vec3.convertFromHEX(lightColorPicker.value,true);
    drawScene(0,true);
})

meshColorPicker.addEventListener("input", function() {
    meshColorVector = Vec3.convertFromHEX(meshColorPicker.value);
    rgbTriangleColors = getColors(surface,meshColorVector);
    isTexture = 0.0;
    drawScene(0,true);
})

// Textures UI
var applyTextureCheckBox = document.getElementById("applyTextureCheckBox") as HTMLInputElement;
var applyNormalMapCheckBox = document.getElementById("applyNormalMapCheckBox") as HTMLInputElement;
if(applyNormalMapCheckBox == null || applyTextureCheckBox == null) {
    throw new Error("applyCheckBoxes");
}

applyTextureCheckBox.addEventListener("input", function() {
    if(applyTextureCheckBox.checked) {
        isTexture = 1.0;
    } else {
        isTexture = 0.0;
    }
    drawScene(0,true);
})

applyNormalMapCheckBox.addEventListener("input", function() {
    if(applyNormalMapCheckBox.checked) {
        isNormalMap = 1.0;
    } else {
        isNormalMap = 0.0;
    }
    drawScene(0,true);
})

var floorTextureButton = document.getElementById("floorTextureButton") as HTMLButtonElement;
var pipesTextureButton = document.getElementById("pipesTextureButton") as HTMLButtonElement;
var floorNormalButton = document.getElementById("floorNormalButton") as HTMLButtonElement;
var pipesNormalButton = document.getElementById("pipesNormalButton") as HTMLButtonElement;
if(floorTextureButton == null || pipesTextureButton == null || floorNormalButton == null || pipesNormalButton == null) {
    throw new Error("texturesError");
}

floorTextureButton.addEventListener("click", function() {
    textureID = "floor";
    loadTexture = true;
    drawScene(0,true);
})

pipesTextureButton.addEventListener("click", function() {
    textureID = "pipes";
    loadTexture = true;
    drawScene(0,true);
})

floorNormalButton.addEventListener("click", function() {
    normalMapID = "floorNormal";
    loadTexture = true;
    drawScene(0,true);
})

pipesNormalButton.addEventListener("click", function() {
    normalMapID = "pipesNormal";
    loadTexture = true;
    drawScene(0,true);
})

// animation ui
var startAnimationButton = document.getElementById("startAnimation") as HTMLButtonElement;
var stopAnimationButton = document.getElementById("stopAnimation") as HTMLButtonElement;
if(startAnimationButton == null || stopAnimationButton == null) {
    throw new Error("animationError");
}

startAnimationButton.addEventListener("click", function() {
    animation = true;
    drawScene();

})

stopAnimationButton.addEventListener("click", function() {
    animation = false;
    cancelAnimationFrame(animationID);
})


// ------------------------------------------------------------------------- Code Below ------------------------------------------------------------------------


// Bezier Surface 
const surfaceModel = new BezierSurfaceModel();

// Triangle Mesh
var precision: number = 20;
const surface = new BezierSurface(precision,surfaceModel);

var triangleVertices = getVertices(surface);
var triangleNormals = getNormals(surface);
var triangleTangents = getTangents(surface);
var rgbTriangleColors = getColors(surface,meshColorVector);
var textureCoords = getTexture(surface);

var lightLocation: Vec3 = new Vec3(xLightLocation,yLightLocation,zLightLocation);

// animation;
var animation: boolean = false;
var rotationSpeed = 100;
var then = 0;
var animationID: number;

// texture
var loadTexture = true;
var textureID: string = "pipes";
var normalMapID: string = "pipesNormal";

// flags
var isTexture = 1.0;
var isNormalMap = 1.0;

var outerEdge:number = 1;
var innerEdge:number = 1;

// ------------------------------------------------------------------------ Main Program -------------------------------------------------------------------------

// getting Canvas
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
if(!canvas) {
    throw new Error("Cant find canvas");
}

var keys: { [key: string]: boolean } = {};

canvas.addEventListener("keydown", function(event) {
    keys[event.key] = true;
})

canvas.addEventListener("keyup", function(event) {
    keys[event.key] = false;
})

// ------------------------------------------------------------------------ Main Program -------------------------------------------------------------------------

// getting gl context
const gl = canvas.getContext('webgl2');
if(!gl) throw new Error("webGL not supported");

// creating a program for drawing a bezier surface
const drawBezierProgram = getProgram(gl,bezierVertexShaderSourceCode,bezierFragmentShaderSourceCode);
if(!drawBezierProgram) throw new Error("getProgramError");

// Attribute locations
const a_texcoord = gl.getAttribLocation(drawBezierProgram, 'a_texcoord');
const a_tangent = gl.getAttribLocation(drawBezierProgram, 'a_tangent');
const a_normal = gl.getAttribLocation(drawBezierProgram, 'a_normal');
const a_vertex = gl.getAttribLocation(drawBezierProgram, 'a_vertex');
const a_color = gl.getAttribLocation(drawBezierProgram, 'a_color');

// Uniform locations
const u_worldViewProjection = gl.getUniformLocation(drawBezierProgram, 'u_worldViewProjection');
const u_lightWorldPosition = gl.getUniformLocation(drawBezierProgram, 'u_lightWorldPosition');
const isNormalMapFSLocation = gl.getUniformLocation(drawBezierProgram, 'isNormalMapFS');
const isNormalMapVSLocation = gl.getUniformLocation(drawBezierProgram, 'isNormalMapVS');
const u_eyePosition = gl.getUniformLocation(drawBezierProgram, 'u_eyePosition');
const isTextureLocation = gl.getUniformLocation(drawBezierProgram, 'isTexture');
const u_lightColor = gl.getUniformLocation(drawBezierProgram, 'u_lightColor');
const u_world = gl.getUniformLocation(drawBezierProgram, 'u_world');
const u_kd = gl.getUniformLocation(drawBezierProgram, 'u_kd');
const u_ks = gl.getUniformLocation(drawBezierProgram, 'u_ks');
const u_m = gl.getUniformLocation(drawBezierProgram, 'u_m');

function drawBezier(gl:WebGL2RenderingContext, program: WebGLProgram, cameraMatrix: M4, cameraPosition: Vec3) {
    
    gl.useProgram(program);

    gl.enableVertexAttribArray(a_vertex);
    gl.enableVertexAttribArray(a_color);
    gl.enableVertexAttribArray(a_normal);
    gl.enableVertexAttribArray(a_texcoord);
    gl.enableVertexAttribArray(a_tangent);

    gl.uniform3fv(u_lightWorldPosition, lightLocation.getVec3ForBuffer());
    gl.uniform3fv(u_eyePosition,cameraPosition.getVec3ForBuffer());
    gl.uniform3fv(u_lightColor,lightColorVector.getVec3ForBuffer());
    gl.uniform1f(u_m,mirror)
    gl.uniform1f(u_ks,ks);
    gl.uniform1f(u_kd,kd);

    gl.uniform1f(isNormalMapFSLocation,isNormalMap);
    gl.uniform1f(isNormalMapVSLocation,isNormalMap);
    gl.uniform1f(isTextureLocation,isTexture);

    var triangleBuffer = createStaticVertexBuffer(gl, triangleVertices);
    var rgbTriabgleBuffer = createStaticVertexBuffer(gl, rgbTriangleColors);
    var normalsBuffer = createStaticVertexBuffer(gl, triangleNormals);
    var tangentsBuffer = createStaticVertexBuffer(gl, triangleTangents);
    var textureBuffer = createStaticVertexBuffer(gl, textureCoords);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(a_vertex, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriabgleBuffer);
    gl.vertexAttribPointer(a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, tangentsBuffer);
    gl.vertexAttribPointer(a_tangent, 3, gl.FLOAT, false, 0, 0);

    // texture
    if(loadTexture) {

        // loading texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        var image = document.getElementById(textureID) as HTMLImageElement;
        if(image == null) {
            throw new Error("imageError");
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // loading normal map
        var normalTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,normalTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        var image = document.getElementById(normalMapID) as HTMLImageElement;
        if(image == null) {
            throw new Error("imageError");
        }
        gl.bindTexture(gl.TEXTURE_2D, normalTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // binding textures
        var texLocation = gl.getUniformLocation(program,'tex');
        var normaltexLocation = gl.getUniformLocation(program,'normalTex');

        gl.uniform1i(texLocation, 0);
        gl.uniform1i(normaltexLocation, 1);

        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, normalTexture);

        loadTexture = false;
    }

    var modelMatrix = M4.scaling(1000,1000,1000);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);

    gl.uniformMatrix4fv(u_world, false, modelMatrix.convert());
    gl.uniformMatrix4fv(u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);
}

// ------------------------------------------------------------------------- Car -------------------------------------------------------------------------
const drawCarProgram = getProgram(gl,carVertexShader,carFragmentShader);
if(!drawCarProgram) throw new Error("getProgramError");

// Attribute locations
const car_a_texcoord = gl.getAttribLocation(drawBezierProgram, 'a_texcoord');
const car_a_vertex = gl.getAttribLocation(drawCarProgram, 'a_vertex');
const car_a_color = gl.getAttribLocation(drawCarProgram, 'a_color');

const car_u_worldViewProjection = gl.getUniformLocation(drawCarProgram, 'u_worldViewProjection');

function drawCar(gl:WebGL2RenderingContext, program: WebGLProgram, cameraMatrix: M4, cameraPosition: Vec3) {
        
    gl.useProgram(program);

    gl.enableVertexAttribArray(car_a_vertex);
    gl.enableVertexAttribArray(car_a_color);
    gl.enableVertexAttribArray(car_a_texcoord);

    var rgb = [];
    for(var i = 0; i < carModel.vertices.length; i+=9) {
        rgb.push(...[0,0,255]);
        rgb.push(...[0,255,0]);
        rgb.push(...[255,0,0]);
    }

    var vertexBuffer = createStaticVertexBuffer(gl, new Float32Array(carModel.vertices));
    var colorBuffer = createStaticVertexBuffer(gl, new Uint8Array(rgb));
    var textureBuffer = createStaticVertexBuffer(gl, new Float32Array(carModel.textures));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(car_a_vertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(car_a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(car_a_texcoord, 2, gl.FLOAT, false, 0, 0);

    if(loadTexture) {

        // loading texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        var image = document.getElementById(textureID) as HTMLImageElement;
        if(image == null) {
            throw new Error("imageError");
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // loading normal map
        var normalTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,normalTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        var image = document.getElementById(normalMapID) as HTMLImageElement;
        if(image == null) {
            throw new Error("imageError");
        }
        gl.bindTexture(gl.TEXTURE_2D, normalTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // binding textures
        var texLocation = gl.getUniformLocation(program,'tex');
        var normaltexLocation = gl.getUniformLocation(program,'normalTex');

        gl.uniform1i(texLocation, 0);
        gl.uniform1i(normaltexLocation, 1);

        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, normalTexture);

        loadTexture = false;
    }

    var modelMatrix = M4.scaling(1000,1000,1000);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
    gl.uniformMatrix4fv(car_u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, carModel.vertices.length / 3);
}


function getCameraMatrix() : M4 {

    // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see 
    var projectionMatrix = M4.perspective(deg2rad(60),canvas.clientWidth/canvas.clientHeight,1,20000);

    // This matrix positions the camera in the u_world 
    var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera); // location of the camera in the space
    var targetPosition: Vec3 = new Vec3(xCameraDirection,yCameraDirection,zCameraDirection); // this dictates in which direction the camera is pointing
    var upVector: Vec3 = new Vec3(0,1,0); // this set the "up" direction of the u_world;
    var cameraMatrix = M4.pointAt(cameraPosition, targetPosition, upVector);
    
    // This matrix is responsible for moving object in the u_world in front of the camera, it is the inversion
    // of camera matrix this way we can obtain static camera effect
    var viewMatrix = cameraMatrix.inverse();
    
    // This matrix first moves the object in front of the camera <vievMatrix> and then clips it into space <projectionMatrix>
    var viewProjectionMatrix = M4.multiply(viewMatrix,projectionMatrix);
    return viewProjectionMatrix;

}

function setRenderingCanvas(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function drawScene(now: number = 0, skip: boolean = false) {

    if(animation && !skip) {
        now *= 0.001;
        var delta = now-then;
        then = now;
        lightLocation.rotate(deg2rad(rotationSpeed * delta),500,500);
        if(keys["ArrowUp"]) {
            yCamera += 10;
        }
        if(keys["ArrowDown"]) {
            yCamera -= 10;
        }
        if(keys["ArrowRight"]) {
            if(innerEdge == 0) outerEdge += 1;
            else innerEdge -= 1;

            surface.liftInnerEdge(innerEdge/10);
            surface.liftOuterEdge(outerEdge/10);
            triangleVertices = getVertices(surface);
            triangleNormals = getNormals(surface);
            triangleTangents = getTangents(surface);
            rgbTriangleColors = getColors(surface,meshColorVector);
            textureCoords = getTexture(surface);
        }
        if(keys["ArrowLeft"]) {
            console.log(outerEdge,innerEdge)
            if(outerEdge == 0) innerEdge += 1;
            else outerEdge -= 1;

            surface.liftInnerEdge(innerEdge/10);
            surface.liftOuterEdge(outerEdge/10);
            triangleVertices = getVertices(surface);
            triangleNormals = getNormals(surface);
            triangleTangents = getTangents(surface);
            rgbTriangleColors = getColors(surface,meshColorVector);
            textureCoords = getTexture(surface);
        }
    }

    if(!gl) throw new Error("webGL not supported");
    if(!drawBezierProgram) throw new Error("getProgramError");
    if(!drawCarProgram) throw new Error("getProgramError");
    
    // View port setup
    setRenderingCanvas(gl,canvas);

    // Camera setup
    var cameraMatrix: M4 = getCameraMatrix();
    var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera); 

    // Drawing bezier surface
    drawBezier(gl, drawBezierProgram, cameraMatrix, cameraPosition);
    drawCar(gl, drawCarProgram, cameraMatrix, cameraPosition);

    // Draw a car model


    if(animation && !skip) {
        animationID = requestAnimationFrame(drawScene);
    }
}

drawScene(0,true);