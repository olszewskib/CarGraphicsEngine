import { BezierSurface, getColors, getNormals, getTangents, getTexture, getVertices } from "./models/bezier/BezierSurface";
import { GlAttributes, createStaticVertexBuffer, getProgram, setRenderingCanvas } from "./webGL";
import { bezierFragmentShaderSourceCode } from "./lib/bezier/fragmentShader";
import { bezierVertexShaderSourceCode } from "./lib/bezier/vertexShader";
import { lightsFragmentShader } from "./lib/lights/lightsFragmentShader";
import { BezierSurfaceModel } from "./models/bezier/BezierSurfaceModel";
import { lightsVertexShader } from "./lib/lights/lightsVertexShader";
import { roadFragmentShader } from "./lib/road/roadFragmentShader";
import { carFragmentShader } from "./lib/car/carFragmentShader";
import { roadVertexShader } from "./lib/road/roadVertexShader";
import { BezierAttribs } from "./models/bezier/BezierAttribs";
import { CarLightModel } from "./models/lights/carLightModel";
import { carVertexShader } from "./lib/car/carVertexShader";
import { deg2rad } from "./models/math/angles";
import { Vec3 } from "./models/math/vec3";
import { OBJParser } from "./objParser";
import { M4 } from "./models/math/m4";

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

// modeling

var txSlider = document.getElementById("Tx") as HTMLInputElement;
var tySlider = document.getElementById("Ty") as HTMLInputElement;
var tzSlider = document.getElementById("Tz") as HTMLInputElement;
if(txSlider == null || tySlider == null || tzSlider == null) {
    throw new Error("modelingError");
}

var Tx: number = parseInt(txSlider.value,10);
var Ty: number = parseInt(tySlider.value,10);
var Tz: number = parseInt(tzSlider.value,10);

txSlider.addEventListener("input", function() {
    Tx = parseInt(txSlider.value,10);
    drawScene(0,true);
})
tySlider.addEventListener("input", function() {
    Ty = parseInt(tySlider.value,10);
    drawScene(0,true);
})
tzSlider.addEventListener("input", function() {
    Tz = parseInt(tzSlider.value,10);
    drawScene(0,true);
})

var rxSlider = document.getElementById("Rx") as HTMLInputElement;
var rySlider = document.getElementById("Ry") as HTMLInputElement;
var rzSlider = document.getElementById("Rz") as HTMLInputElement;
if(rxSlider == null || rySlider == null || rzSlider == null) {
    throw new Error("modelingError");
}

var Rx: number = parseInt(rxSlider.value,10);
var Ry: number = parseInt(rySlider.value,10);
var Rz: number = parseInt(rzSlider.value,10);

rxSlider.addEventListener("input", function() {
    Rx = parseInt(rxSlider.value,10);
    drawScene(0,true);
})
rySlider.addEventListener("input", function() {
    Ry = parseInt(rySlider.value,10);
    drawScene(0,true);
})
rzSlider.addEventListener("input", function() {
    Rz = parseInt(rzSlider.value,10);
    drawScene(0,true);
})

var sxSlider = document.getElementById("Sx") as HTMLInputElement;
var sySlider = document.getElementById("Sy") as HTMLInputElement;
var szSlider = document.getElementById("Sz") as HTMLInputElement;
if(sxSlider == null || sySlider == null || szSlider == null) {
    throw new Error("modelingError");
}

var Sx: number = parseInt(sxSlider.value,10);
var Sy: number = parseInt(sySlider.value,10);
var Sz: number = parseInt(szSlider.value,10);

sxSlider.addEventListener("input", function() {
    Sx = parseInt(sxSlider.value,10);
    drawScene(0,true);
})
sySlider.addEventListener("input", function() {
    Sy = parseInt(sySlider.value,10);
    drawScene(0,true);
})
szSlider.addEventListener("input", function() {
    Sz = parseInt(szSlider.value,10);
    drawScene(0,true);
})

// ------------------------------------------------------------------------- Flags ------------------------------------------------------------------------

var lightLocation: Vec3 = new Vec3(xLightLocation,yLightLocation,zLightLocation);

// animation;
var animation: boolean = false;
var rotationSpeed = 100;
var then = 0;
var animationID: number;

// texture
var loadTexture = true;
var textureID: string = "road";
var normalMapID: string = "roadNormal";

// flags
var isTexture = 1.0;
var isNormalMap = 1.0;

var outerEdge:number = 1;
var innerEdge:number = 1;

// ------------------------------------------------------------------------ Canvas -------------------------------------------------------------------------

const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
if(!canvas) throw new Error("Cant find canvas");

var keys: { [key: string]: boolean } = {};
canvas.addEventListener("keydown", function(event) { keys[event.key] = true; })
canvas.addEventListener("keyup", function(event) { keys[event.key] = false; })

// ------------------------------------------------------------------------ GL -------------------------------------------------------------------------

export const gl = canvas.getContext('webgl2');
if(!gl) throw new Error("webGL not supported");

// ------------------------------------------------------------------------ Bezier Surface -------------------------------------------------------------------------

const surfaceModel = new BezierSurfaceModel();

var precision: number = 20;
const surface = new BezierSurface(precision,surfaceModel);

var triangleVertices = getVertices(surface);
var triangleNormals = getNormals(surface);
var triangleTangents = getTangents(surface);
var rgbTriangleColors = getColors(surface,meshColorVector);
var textureCoords = getTexture(surface);

export const drawBezierProgram = getProgram(gl,bezierVertexShaderSourceCode,bezierFragmentShaderSourceCode);
if(!drawBezierProgram) throw new Error("getProgramError");

const bezierAttributes = new GlAttributes(gl,drawBezierProgram);

function drawBezier(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3) {
    
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.a_vertex);
    gl.enableVertexAttribArray(attributes.a_color);
    gl.enableVertexAttribArray(attributes.a_normal);
    gl.enableVertexAttribArray(attributes.a_texcoord);
    gl.enableVertexAttribArray(attributes.a_tangent);

    gl.uniform3fv(attributes.u_lightWorldPosition, lightLocation.getVec3ForBuffer());
    gl.uniform3fv(attributes.u_eyePosition,cameraPosition.getVec3ForBuffer());
    gl.uniform3fv(attributes.u_lightColor,lightColorVector.getVec3ForBuffer());
    gl.uniform1f(attributes.u_m,mirror)
    gl.uniform1f(attributes.u_ks,ks);
    gl.uniform1f(attributes.u_kd,kd);

    gl.uniform1f(attributes.isNormalMapFSLocation,isNormalMap);
    gl.uniform1f(attributes.isNormalMapVSLocation,isNormalMap);
    gl.uniform1f(attributes.isTextureLocation,isTexture);

    var triangleBuffer = createStaticVertexBuffer(gl, triangleVertices);
    var rgbTriabgleBuffer = createStaticVertexBuffer(gl, rgbTriangleColors);
    var normalsBuffer = createStaticVertexBuffer(gl, triangleNormals);
    var tangentsBuffer = createStaticVertexBuffer(gl, triangleTangents);
    var textureBuffer = createStaticVertexBuffer(gl, textureCoords);

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
    var rotationMatrix = M4.rotationZ(deg2rad(90));
    modelMatrix = M4.multiply(modelMatrix,rotationMatrix);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);

    gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
    gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);
}

// ------------------------------------------------------------------------- Car -------------------------------------------------------------------------

const carObjUrl = 'resources/obj/porsche/Porsche_911_GT2.obj';
var carModel = new OBJParser();

await fetch(carObjUrl)
  .then(response => response.text())
  .then(objContent => {
    carModel.parse(objContent);
  })
  .catch(error => {
    console.error('Error fetching the OBJ file:', error);
  });

const drawCarProgram = getProgram(gl,carVertexShader,carFragmentShader);
if(!drawCarProgram) throw new Error("getProgramError");

const carAttributes = new GlAttributes(gl,drawCarProgram);

function drawCar(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3) {
        
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.a_vertex);
    gl.enableVertexAttribArray(attributes.a_color);
    gl.enableVertexAttribArray(attributes.a_texcoord);
    gl.enableVertexAttribArray(attributes.a_normal);

    gl.uniform3fv(attributes.u_lightWorldPosition, lightLocation.getVec3ForBuffer());
    gl.uniform3fv(attributes.u_eyePosition,cameraPosition.getVec3ForBuffer());
    gl.uniform3fv(attributes.u_lightColor,lightColorVector.getVec3ForBuffer());
    gl.uniform1f(attributes.u_m,mirror)
    gl.uniform1f(attributes.u_ks,ks);
    gl.uniform1f(attributes.u_kd,kd);

    var rgb = [];
    for(var i = 0; i < carModel.vertices.length; i+=9) {
        rgb.push(...[255,0,0]);
        rgb.push(...[255,0,0]);
        rgb.push(...[255,0,0]);
    }

    var vertexBuffer = createStaticVertexBuffer(gl, new Float32Array(carModel.vertices));
    var colorBuffer = createStaticVertexBuffer(gl, new Uint8Array(rgb));
    var normalsBuffer = createStaticVertexBuffer(gl, new Float32Array(carModel.normals));
    var textureBuffer = createStaticVertexBuffer(gl, new Float32Array(carModel.textures));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(attributes.a_normal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);

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

    }

    var modelMatrix = M4.scaling(200,200,200);
    var xRotationMatrix = M4.rotationX(deg2rad(90));
    var zRotationMatrix = M4.rotationZ(deg2rad(180));
    var translationMatrix = M4.translation(500,500,115);
    modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
    gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
    gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, carModel.vertices.length / 3);
}

// ------------------------------------------------------------------------- Road -------------------------------------------------------------------------
const roadObjUrl = 'resources/obj/road/rd.obj';
var roadModel = new OBJParser();

await fetch(roadObjUrl)
  .then(response => response.text())
  .then(objContent => {
    roadModel.parse(objContent);
  })
  .catch(error => {
    console.error('Error fetching the OBJ file:', error);
  });
  
const drawRoadProgram = getProgram(gl,roadVertexShader,roadFragmentShader);
if(!drawRoadProgram) throw new Error("getProgramError");

const roadAttributes = new GlAttributes(gl,drawRoadProgram);
function drawRoad(gl: WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, cameraMatrix: M4, cameraPosition: Vec3, dy: number) {
        
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.a_vertex);
    gl.enableVertexAttribArray(attributes.a_color);
    gl.enableVertexAttribArray(attributes.a_texcoord);

    var lights = [...lightLocation.getVec3ForBuffer(), 376, 157, 128, 626, 144, 127 ]
    gl.uniform3fv(attributes.u_lightWorldPosition, lights);
    gl.uniform3fv(attributes.u_eyePosition,cameraPosition.getVec3ForBuffer());
    var lightColor = [...lightColorVector.getVec3ForBuffer(), 1,1,0, 1,1,0];
    console.log(lightColor)
    gl.uniform3fv(attributes.u_lightColor,lightColor);
    gl.uniform1f(attributes.u_m,mirror)
    gl.uniform1f(attributes.u_ks,ks);
    gl.uniform1f(attributes.u_kd,kd);



    var vertexBuffer = createStaticVertexBuffer(gl, triangleVertices);
    var colorBuffer = createStaticVertexBuffer(gl, rgbTriangleColors);
    var textureBuffer = createStaticVertexBuffer(gl, textureCoords);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);

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
    }

    var modelMatrix = M4.scaling(1000,1000,1000);
    var zRotationMatrix = M4.rotationZ(deg2rad(90));
    var translationMatrix = M4.translation(1000,dy,0);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
    gl.uniformMatrix4fv(attributes.u_world, false, modelMatrix.convert());
    gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);
}

// ------------------------------------------------------------------------- Lights -------------------------------------------------------------------------
const lightMesh = new CarLightModel(20,1);
lightMesh.createSphereArrayBuffer(30,15);
const lightBufferData: Float32Array = lightMesh.bufferData;

function getRightLightModelMatrix(): M4 {
    var modelMatrix = M4.scaling(24,15,43);
    var xRotationMatrix = M4.rotationX(deg2rad(118));
    var yRotationMatrix = M4.rotationY(deg2rad(186));
    var zRotationMatrix = M4.rotationZ(deg2rad(0));
    var translationMatrix = M4.translation(376,157,128);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,yRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    return modelMatrix;

}

function getLeftLightModelMatrix(): M4 {
    var modelMatrix = M4.scaling(28,12,41);
    var xRotationMatrix = M4.rotationX(deg2rad(121));
    var yRotationMatrix = M4.rotationY(deg2rad(360));
    var zRotationMatrix = M4.rotationZ(deg2rad(176));
    var translationMatrix = M4.translation(626,144,127);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,yRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    return modelMatrix;

}

const drawLightProgram = getProgram(gl,lightsVertexShader,lightsFragmentShader);
if(!drawLightProgram) throw new Error("getProgramError");

const lightAttributes = new GlAttributes(gl,drawLightProgram);

function drawLights(gl:WebGL2RenderingContext, program: WebGLProgram, attributes: GlAttributes, modelMatrix: M4, cameraMatrix: M4, cameraPosition: Vec3) {
    gl.useProgram(program);

    gl.enableVertexAttribArray(attributes.a_vertex);
    gl.enableVertexAttribArray(attributes.a_color);

    var rgb = [];
    for(var i = 0; i < lightBufferData.length; i+=9) {
        rgb.push(...[255,255,0]);
        rgb.push(...[255,255,0]);
        rgb.push(...[255,255,0]);
    }

    var vertexBuffer = createStaticVertexBuffer(gl, lightBufferData);
    var colorBuffer = createStaticVertexBuffer(gl, new Uint8Array(rgb));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(attributes.a_vertex, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(attributes.a_color, 3, gl.UNSIGNED_BYTE, true, 0, 0);
 
    var worldViewProjectionMatrix = M4.multiply(modelMatrix,cameraMatrix);
    gl.uniformMatrix4fv(attributes.u_worldViewProjection, false, worldViewProjectionMatrix.convert());

    gl.drawArrays(gl.TRIANGLES, 0, lightBufferData.length / 3);
}


// ------------------------------------------------------------------------- Camera -------------------------------------------------------------------------

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

// ------------------------------------------------------------------------- Drawing -------------------------------------------------------------------------

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
    if(!drawRoadProgram) throw new Error("getProgramError");
    if(!drawLightProgram) throw new Error("getProgramError");
    
    // View port setup
    setRenderingCanvas(gl,canvas);

    // Camera setup
    var cameraMatrix: M4 = getCameraMatrix();
    var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera); 

    //drawBezier(gl, drawBezierProgram, bezierAttributes, cameraMatrix, cameraPosition);
    drawCar(gl, drawCarProgram, carAttributes, cameraMatrix, cameraPosition);
    drawRoad(gl, drawRoadProgram, roadAttributes, cameraMatrix, cameraPosition,2000);
    drawRoad(gl, drawRoadProgram, roadAttributes, cameraMatrix, cameraPosition,1000);
    drawRoad(gl, drawRoadProgram, roadAttributes, cameraMatrix, cameraPosition,0);
    drawRoad(gl, drawRoadProgram, roadAttributes, cameraMatrix, cameraPosition,-1000);
    drawLights(gl, drawLightProgram, lightAttributes, getRightLightModelMatrix(), cameraMatrix, cameraPosition);
    drawLights(gl, drawLightProgram, lightAttributes, getLeftLightModelMatrix(), cameraMatrix, cameraPosition);
    loadTexture = false;



    if(animation && !skip) {
        animationID = requestAnimationFrame(drawScene);
    }
}

drawScene(0,true);