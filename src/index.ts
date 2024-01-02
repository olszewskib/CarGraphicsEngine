import { BezierSurfaceModel } from "./models/bezier/BezierSurfaceModel";
import { fragmentShaderSourceCode } from "./lib/fragmentShader";
import { vertexShaderSourceCode } from "./lib/vertexShader";
import { M4 } from "./models/math/m4";
import { deg2rad } from "./models/math/angles";
import { Vec3 } from "./models/math/vec3";
import { BezierSurface, getBiTangents, getColors, getNormals, getTangents, getTexture, getVertices } from "./models/bezier/BezierSurface";
import { createStaticVertexBuffer, getProgram } from "./webGL";


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
    drawTriangles(0,true);
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
    drawTriangles(0,true)
    
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
    drawTriangles(0,true);
});
yCameraSlider.addEventListener("input", function() {
    yCamera = parseInt(yCameraSlider.value,10);
    drawTriangles(0,true);
});
zCameraSlider.addEventListener("input", function() {
    zCamera = parseInt(zCameraSlider.value,10);
    drawTriangles(0,true);
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
    drawTriangles(0,true);
});
yCameraDirectionSlider.addEventListener("input", function() {
    yCameraDirection = parseInt(yCameraDirectionSlider.value,10);
    drawTriangles(0,true);
});
zCameraDirectionSlider.addEventListener("input", function() {
    zCameraDirection = parseInt(zCameraDirectionSlider.value,10);
    drawTriangles(0,true);
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
    drawTriangles(0,true);
});
yLightLocationSlider.addEventListener("input", function() {
    lightLocation.v2 = parseInt(yLightLocationSlider.value,10);
    drawTriangles(0,true);
});
zLightLocationSlider.addEventListener("input", function() {
    lightLocation.v3 = parseInt(zLightLocationSlider.value,10);
    drawTriangles(0,true);
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
    drawTriangles(0,true);
})
ksSlider.addEventListener("input", function() {
    ks = parseFloat(ksSlider.value);
    drawTriangles(0,true);
})
mirrorSlider.addEventListener("input", function() {
    mirror = parseInt(mirrorSlider.value,10);
    drawTriangles(0,true);
})

// Colors UI
const lightColorPicker = document.getElementById("lightColor") as HTMLInputElement;
const meshColorPicker = document.getElementById("meshColor") as HTMLInputElement;
if(lightColorPicker == null || meshColorPicker == null) {
    throw new Error("colorpicker");
}

var lightColorVector: Vec3 = Vec3.convertFromHEX(lightColorPicker.value,true);
var meshColorVector: Vec3 = Vec3.convertFromHEX(meshColorPicker.value);

lightColorPicker.addEventListener("input", function() {
    lightColorVector = Vec3.convertFromHEX(lightColorPicker.value,true);
    drawTriangles(0,true);
})

meshColorPicker.addEventListener("input", function() {
    meshColorVector = Vec3.convertFromHEX(meshColorPicker.value);
    rgbTriangleColors = getColors(surface,meshColorVector);
    isTexture = 0.0;
    drawTriangles(0,true);
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
    drawTriangles(0,true);
})

applyNormalMapCheckBox.addEventListener("input", function() {
    if(applyNormalMapCheckBox.checked) {
        isNormalMap = 1.0;
    } else {
        isNormalMap = 0.0;
    }
    drawTriangles(0,true);
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
    drawTriangles(0,true);
})

pipesTextureButton.addEventListener("click", function() {
    textureID = "pipes";
    loadTexture = true;
    drawTriangles(0,true);
})

floorNormalButton.addEventListener("click", function() {
    normalMapID = "floorNormal";
    loadTexture = true;
    drawTriangles(0,true);
})

pipesNormalButton.addEventListener("click", function() {
    normalMapID = "pipesNormal";
    loadTexture = true;
    drawTriangles(0,true);
})

// animation ui
var startAnimationButton = document.getElementById("startAnimation") as HTMLButtonElement;
var stopAnimationButton = document.getElementById("stopAnimation") as HTMLButtonElement;
if(startAnimationButton == null || stopAnimationButton == null) {
    throw new Error("animationError");
}

startAnimationButton.addEventListener("click", function() {
    animation = true;
    drawTriangles();

})

stopAnimationButton.addEventListener("click", function() {
    animation = false;
    cancelAnimationFrame(animationID);
})


// ------------------------------------------------------------------------- Code Below ------------------------------------------------------------------------


// Bezier Surface 
const surfaceModel = new BezierSurfaceModel();
//surface.setControlPointZValue(1,1,0.7);
//surface.setControlPointZValue(3,2,0.7);

// Triangle Mesh
var precision: number = 60;
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


// getting gl context
const gl = canvas.getContext('webgl2');
if(!gl) {
    throw new Error("webGL not supported");
}

// creating a program
const drawTriangleProgram = getProgram(gl,vertexShaderSourceCode,fragmentShaderSourceCode);
    
if(!drawTriangleProgram) {
    throw new Error("getProgramError");
}

// Attribute locations
const vertexPositionAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexPosition');
const vertexColorAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexColor');
const vertexNormalAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexNormal');
const vertexTangentAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'vertexTangent');
const vertexTextureAttributeLocation = gl.getAttribLocation(drawTriangleProgram, 'texPosition');

// Uniform locations
const worldViewProjectionLocation = gl.getUniformLocation(drawTriangleProgram, 'worldViewProjection');
const worldLocation = gl.getUniformLocation(drawTriangleProgram, 'world');
const lightPositionLocation = gl.getUniformLocation(drawTriangleProgram, 'lightPosition');
const eyePositionLocation = gl.getUniformLocation(drawTriangleProgram, 'eyePosition');
const mirrorLocation = gl.getUniformLocation(drawTriangleProgram, 'mirror');
const lightColorLocation = gl.getUniformLocation(drawTriangleProgram, 'lightColor');
const kdLocation = gl.getUniformLocation(drawTriangleProgram, 'kd');
const ksLocation = gl.getUniformLocation(drawTriangleProgram, 'ks');
const isNormalMapFSLocation = gl.getUniformLocation(drawTriangleProgram, 'isNormalMapFS');
const isNormalMapVSLocation = gl.getUniformLocation(drawTriangleProgram, 'isNormalMapVS');
const isTextureLocation = gl.getUniformLocation(drawTriangleProgram, 'isTexture');

function drawTriangles(now: number = 0, skip: boolean = false) {

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
    }

    if(!gl) {
        throw new Error("webGL not supported");
    }
    if(!drawTriangleProgram) {
        throw new Error("getProgramError");
    }
    
    // loading data to vertex buffers
    var triangleBuffer = createStaticVertexBuffer(gl, triangleVertices); // only on precision change
    var rgbTriabgleBuffer = createStaticVertexBuffer(gl, rgbTriangleColors); // on color change
    var normalsBuffer = createStaticVertexBuffer(gl, triangleNormals); // on precision change
    var tangentsBuffer = createStaticVertexBuffer(gl, triangleTangents); // on precision change
    var textureBuffer = createStaticVertexBuffer(gl, textureCoords);

    // Output merger (how to apply an updated pixel to the output image)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Attatch all needed attributes
    gl.useProgram(drawTriangleProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(vertexColorAttributeLocation);
    gl.enableVertexAttribArray(vertexNormalAttributeLocation);
    gl.enableVertexAttribArray(vertexTextureAttributeLocation);

    // How to read vertex information from buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(vertexPositionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.vertexAttribPointer(vertexNormalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriabgleBuffer);
    gl.vertexAttribPointer(vertexColorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(vertexTextureAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // texture
    if(loadTexture) {

        gl.enableVertexAttribArray(vertexTangentAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, tangentsBuffer);
        gl.vertexAttribPointer(vertexTangentAttributeLocation, 3, gl.FLOAT, false, 0, 0);

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
        var texLocation = gl.getUniformLocation(drawTriangleProgram,'tex');
        var normaltexLocation = gl.getUniformLocation(drawTriangleProgram,'normalTex');

        gl.uniform1i(texLocation, 0);
        gl.uniform1i(normaltexLocation, 1);

        gl.activeTexture(gl.TEXTURE0 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.activeTexture(gl.TEXTURE1 + 0.0);
        gl.bindTexture(gl.TEXTURE_2D, normalTexture);

        loadTexture = false;
    }

    // This matrix converts a frustum of space into a clip space, so basicly it which part of space we can see 
    var projectionMatrix = M4.perspective(deg2rad(120),canvas.clientWidth/canvas.clientHeight,1,2000);

    // This matrix positions the camera in the world 
    var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera); // location of the camera in the space
    var targetPosition: Vec3 = new Vec3(xCameraDirection,yCameraDirection,zCameraDirection); // this dictates in which direction the camera is pointing
    var upVector: Vec3 = new Vec3(0,1,0); // this set the "up" direction of the world;
    var cameraMatrix = M4.pointAt(cameraPosition, targetPosition, upVector);
    
    // This matrix is responsible for moving object in the world in front of the camera, it is the inversion
    // of camera matrix this way we can obtain static camera effect
    var viewMatrix = cameraMatrix.inverse();
    
    // This matrix first moves the object in front of the camera <vievMatrix> and then clips it into space <projectionMatrix>
    var viewProjectionMatrix = M4.multiply(viewMatrix,projectionMatrix);

    // This matrix takes the vertices of the model and moved them to the world space, so basicly it determines where things are
    var modelMatrix = M4.scaling(1000,2000,1000);
    var translationMatrix = M4.translation(1000,-1000,0);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);

    // This matix first moves our obj <worldMatrix> then when it is set it moves it in front of the camera <viewMatix> and lastly clips it into space <projectionMatrix>
    var worldViewProjectionMatrix = M4.multiply(modelMatrix,viewProjectionMatrix);

    gl.uniformMatrix4fv(worldLocation, false, modelMatrix.convert());
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.convert());
    
    gl.uniform3fv(lightPositionLocation, lightLocation.getVec3ForBuffer());
    gl.uniform3fv(eyePositionLocation,cameraPosition.getVec3ForBuffer());
    gl.uniform3fv(lightColorLocation,lightColorVector.getVec3ForBuffer());
    gl.uniform1f(mirrorLocation,mirror)
    gl.uniform1f(ksLocation,ks);
    gl.uniform1f(kdLocation,kd);
    
    // flags
    gl.uniform1f(isNormalMapFSLocation,isNormalMap);
    gl.uniform1f(isNormalMapVSLocation,isNormalMap);
    gl.uniform1f(isTextureLocation,isTexture);

    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);

    ////////////////////// 2nd Surface ///////////////////////////////
    
    var modelMatrix = M4.scaling(1000,2000,1000);
    var rotationMatrix = M4.rotationZ(deg2rad(90));
    var translationMatrix = M4.translation(1000,1000,0);
    translationMatrix = M4.multiply(rotationMatrix, translationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,viewProjectionMatrix);

    gl.uniformMatrix4fv(worldLocation, false, modelMatrix.convert());
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.convert());
    
    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);

    ////////////////////// 3nd Surface ///////////////////////////////

    var modelMatrix = M4.scaling(1000,2000,1000);
    var rotationMatrix = M4.rotationZ(deg2rad(180));
    var translationMatrix = M4.translation(-1000,1000,0);
    translationMatrix = M4.multiply(rotationMatrix, translationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,viewProjectionMatrix);

    gl.uniformMatrix4fv(worldLocation, false, modelMatrix.convert());
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.convert());
    
    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);

    ////////////////////// 4nd Surface ///////////////////////////////

    var modelMatrix = M4.scaling(1000,2000,1000);
    var rotationMatrix = M4.rotationZ(deg2rad(270));
    var translationMatrix = M4.translation(-1000,-1000,0);
    translationMatrix = M4.multiply(rotationMatrix, translationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);

    var worldViewProjectionMatrix = M4.multiply(modelMatrix,viewProjectionMatrix);

    gl.uniformMatrix4fv(worldLocation, false, modelMatrix.convert());
    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.convert());
    
    gl.drawArrays(gl.TRIANGLES, 0, surface.triangles.length * 3);

    if(animation && !skip) {
        animationID = requestAnimationFrame(drawTriangles);
    }
}

drawTriangles(0,true);