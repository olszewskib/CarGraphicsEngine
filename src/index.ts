import { BezierSurface, getColors, getNormals, getTangents, getTexture, getVertices } from "./models/bezier/BezierSurface";
import { GlAttributes, createTexture, getProgram, setRenderingCanvas } from "./webGL";
import { bezierFragmentShaderSourceCode } from "./lib/bezier/fragmentShader";
import { bezierVertexShaderSourceCode } from "./lib/bezier/vertexShader";
import { lightsFragmentShader } from "./lib/lights/lightsFragmentShader";
import { BezierSurfaceModel } from "./models/bezier/BezierSurfaceModel";
import { lightsVertexShader } from "./lib/lights/lightsVertexShader";
import { roadFragmentShader } from "./lib/road/roadFragmentShader";
import { carFragmentShader } from "./lib/car/carFragmentShader";
import { roadVertexShader } from "./lib/road/roadVertexShader";
import { CarLightModel } from "./models/lights/carLightModel";
import { carVertexShader } from "./lib/car/carVertexShader";
import { getCameraMatrix } from "./models/camera/camera";
import { deg2rad } from "./models/math/angles";
import { Vec3 } from "./models/math/vec3";
import { OBJParser } from "./models/parser/objParser";
import { M4 } from "./models/math/m4";
import { CarLight } from "./models/lights/carLight";
import { TileModel } from "./models/road/tileModel";
import { Tile } from "./models/road/tile";
import { CarModel } from "./models/car/carModel";
import { Car } from "./models/car/car";
import { SceneLight } from "./models/lights/sceneLight";
import { Textures } from "./textures";

const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

if(zSlider == null)
    throw new Error("slider not found");

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
    rgbTriangleColors = getColors(surface);
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

// ------------------------------------------------------------------------- Flags ---------------------------

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

// ------------------------------------------------------------------------ Canvas ----------------------------------------------

const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
if(!canvas) throw new Error("Cant find canvas");

var keys: { [key: string]: boolean } = {};
canvas.addEventListener("keydown", function(event) { keys[event.key] = true; })
canvas.addEventListener("keyup", function(event) { keys[event.key] = false; })

// ------------------------------------------------------------------------ GL -----------------------------------------

export const gl = canvas.getContext('webgl2');
if(!gl) throw new Error("webGL not supported");

// ------------------------------------------------------------------------- Lights ----------------------------------------------

var sceneLight = new SceneLight(lightLocation, 50, new Vec3(255,255,255));
//var sceneLight2 = new SceneLight(new Vec3(lightLocation.v1+1000, lightLocation.v2, lightLocation.v3), 50, new Vec3(255,255,255));

const lightMesh = new CarLightModel(20,1);
lightMesh.createSphereArrayBuffer(30,15);

var rightHeadLight = new CarLight(new Vec3(376,157,128),new Vec3(118,186,0),new Vec3(24,15,43), new Vec3(255,255,0), lightMesh);
var leftHeadLight = new CarLight(new Vec3(626,144,127),new Vec3(121,360,176),new Vec3(28,12,41), new Vec3(255,255,0), lightMesh);
var rightRearLight = new CarLight(new Vec3(376,876,127),new Vec3(0,0,61),new Vec3(50,26,11), new Vec3(255,0,0), lightMesh); 
var leftRearLight = new CarLight(new Vec3(626,876,127),new Vec3(0,0,298),new Vec3(50,26,11), new Vec3(255,0,0), lightMesh); 

var carLights = [rightHeadLight,leftHeadLight,rightRearLight,leftRearLight];
var worldLights = [...carLights, sceneLight] //, sceneLight2];

const drawLightProgram = getProgram(gl,lightsVertexShader,lightsFragmentShader);
if(!drawLightProgram) throw new Error("getProgramError");

const lightAttributes = new GlAttributes(gl,drawLightProgram);

// ------------------------------------------------------------------------ Bezier Surface -------------------------------

const bezierProgram = getProgram(gl,bezierVertexShaderSourceCode,bezierFragmentShaderSourceCode);
if(!bezierProgram) throw new Error("getProgramError");

const surfaceModel = new BezierSurfaceModel();

var bezierTexture = await Textures.fetchTexture('resources/obj/city/garage/door/door.jpg');
var bezierNormalMap = await Textures.fetchTexture('resources/obj/city/garage/door/doorNormal.jpg');

var bezierTextures = createTexture(gl,bezierProgram,bezierTexture,bezierNormalMap);
if(bezierTextures[0] == null || bezierTextures[1] == null) throw new Error("textureError");

var precision: number = 20;
const surface = new BezierSurface(
    precision,surfaceModel,
    lightLocation, carLights,
    bezierTextures[0],
    bezierTextures[1], 
    mirror, 
    ks, 
    kd);

var triangleVertices = getVertices(surface);
var triangleNormals = getNormals(surface);
var triangleTangents = getTangents(surface);
var rgbTriangleColors = getColors(surface);
var textureCoords = getTexture(surface);


const bezierAttributes = new GlAttributes(gl,bezierProgram);

// ------------------------------------------------------------------------- Car --------------------------------------

const carObjUrl = 'resources/obj/porsche/Porsche_911_GT2.obj';
var carObjModel = new OBJParser();

await fetch(carObjUrl)
  .then(response => response.text())
  .then(objContent => {
    carObjModel.parse(objContent);
  })
  .catch(error => {
    console.error('Error fetching the OBJ file:', error);
  });

const carProgram = getProgram(gl,carVertexShader,carFragmentShader);
if(!carProgram) throw new Error("getProgramError");

var carTexture = document.getElementById('metal') as HTMLImageElement;
if(carTexture == null) throw new Error("imageError");

var carNormalMap = document.getElementById(normalMapID) as HTMLImageElement;
if(carNormalMap == null) throw new Error("imageError");

var carTextures = createTexture(gl,carProgram,carTexture,carNormalMap);
if(carTextures[0] == null || carTextures[1] == null) throw new Error("textureError");

var carModel = new CarModel(carObjModel.verticesBuffer,
        carObjModel.normalsBuffer,
        carObjModel.textureBuffer,
        carTextures[0],
        carTextures[1],
        mirror,
        ks, 
        kd
    );

var car = new Car(carModel,lightLocation,carLights);

const carAttributes = new GlAttributes(gl,carProgram);

// ------------------------------------------------------------------------- Road --------------------------------

const scale = 1000;

const roadProgram = getProgram(gl,roadVertexShader,roadFragmentShader);
if(!roadProgram) throw new Error("getProgramError");

var roadTexture = document.getElementById(textureID) as HTMLImageElement;
if( roadTexture == null) throw new Error("imageError");

var roadNormalMap = document.getElementById(normalMapID) as HTMLImageElement;
if( roadNormalMap == null) throw new Error("imageError"); 

var roadTextures = createTexture(gl,roadProgram, roadTexture, roadNormalMap);
if(roadTextures[0] == null || roadTextures[1] == null) throw new Error("textureError");

var roadModel = new TileModel(triangleVertices,textureCoords,roadTextures[0],roadTextures[1],mirror,ks,kd);
var road = new Tile(roadModel, worldLights, M4.getInitMatirx(new Vec3(0,- 2 * scale,0), new Vec3(0,0,0), new Vec3(1000,1000,1000)));

const roadAttributes = new GlAttributes(gl,roadProgram);

// ------------------------------------------------------------------------- Walls --------------------------------

var wallTexture = Textures.getTexture(document, 'brick');
var wallNormalMap = Textures.getTexture(document, 'brickNormal');

var wallTextures = createTexture(gl,roadProgram, wallTexture, wallNormalMap);
if(wallTextures[0] == null || wallTextures[1] == null) throw new Error("textureError");

var wallModel = new TileModel(triangleVertices,textureCoords,wallTextures[0],wallTextures[1],mirror,ks,kd);
var backWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(0,1000,0), new Vec3(90,0,0), new Vec3(scale,scale/2,scale)));
var leftWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(0,0,0), new Vec3(90,90,0), new Vec3(scale,scale/2,scale)));
var rightWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(1000,1000,0), new Vec3(90,270,0), new Vec3(scale,scale/2,scale)));
var topWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(0,scale,scale/2), new Vec3(180,0,0), new Vec3(scale,scale,scale)));
var outsideWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(-1000,0,0), new Vec3(90,0,0), new Vec3(scale,scale/2,scale)));

var brickWalls = [backWall,leftWall,rightWall,topWall];

// Garage
var garageTexture = document.getElementById('garage') as HTMLImageElement;
if( garageTexture == null) throw new Error("imageError");

var garageNormalMap = document.getElementById('garageNormal') as HTMLImageElement;
if( garageNormalMap == null) throw new Error("imageError");

var garageTextures = createTexture(gl,roadProgram, garageTexture, garageNormalMap);
if(garageTextures[0] == null || garageTextures[1] == null) throw new Error("textureError");

var garageModel = new TileModel(triangleVertices,textureCoords,garageTextures[0],garageTextures[1],mirror,ks,kd);
var garageFloor = new Tile(garageModel,worldLights, M4.getInitMatirx(new Vec3(0,0,0), new Vec3(0,0,0), new Vec3(scale,scale,scale)));

// Fasade
var cityTexture = document.getElementById('city') as HTMLImageElement;
if( cityTexture == null) throw new Error("imageError");

var cityNormalMap = document.getElementById('cityNormal') as HTMLImageElement;
if( cityNormalMap == null) throw new Error("imageError");

var cityTextures = createTexture(gl,roadProgram, cityTexture, cityNormalMap);
if(cityTextures[0] == null || cityTextures[1] == null) throw new Error("textureError");

var cityModel = new TileModel(triangleVertices,textureCoords,cityTextures[0],cityTextures[1],mirror,ks,kd);
var fasade = new Tile(cityModel,worldLights, M4.getInitMatirx(new Vec3(scale,0,scale + scale / 2), new Vec3(90,0,180), new Vec3(scale,scale,scale)));

// Pavement
var pavementTexture = document.getElementById('pavement') as HTMLImageElement;
if( pavementTexture == null) throw new Error("imageError");

var pavementNormalMap = document.getElementById('pavementNormal') as HTMLImageElement;
if( pavementNormalMap == null) throw new Error("imageError");

var pavementTextures = createTexture(gl,roadProgram, pavementTexture, pavementNormalMap);
if(pavementTextures[0] == null || pavementTextures[1] == null) throw new Error("textureError");

var pavementModel = new TileModel(triangleVertices,textureCoords,pavementTextures[0],pavementTextures[1],mirror,ks,kd);
var pavement = new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(-scale/4,-scale/4,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)));

// Drivein
var driveinTexture = document.getElementById('drivein') as HTMLImageElement;
if( driveinTexture == null) throw new Error("imageError");

var driveinNormalMap = document.getElementById('driveinNormal') as HTMLImageElement;
if( driveinNormalMap == null) throw new Error("imageError");

var driveinTextures = createTexture(gl,roadProgram, driveinTexture, driveinNormalMap);
if(driveinTextures[0] == null || driveinTextures[1] == null) throw new Error("textureError");

var driveinModel = new TileModel(triangleVertices,textureCoords,driveinTextures[0],driveinTextures[1],mirror,ks,kd);
var drivein = new Tile(driveinModel,worldLights, M4.getInitMatirx(new Vec3(scale/2,-scale/4,0), new Vec3(0,0,90), new Vec3(scale/4,scale/4,scale/4)));

// Grass
var grassTexture = document.getElementById('grass') as HTMLImageElement;
if( grassTexture == null) throw new Error("imageError");

var grassNormalMap = document.getElementById('grassNormal') as HTMLImageElement;
if( grassNormalMap == null) throw new Error("imageError");

var grassTextures = createTexture(gl,roadProgram, grassTexture, grassNormalMap);
if(grassTextures[0] == null || grassTextures[1] == null) throw new Error("textureError");

var grassModel = new TileModel(triangleVertices,textureCoords,grassTextures[0],grassTextures[1],mirror,ks,kd);
var grass = new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(-scale/4,-scale/4,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)));

// ------------------------------------------------------------------------- Drawing ------------------------

function getModelMatrix(): M4 {
    var modelMatrix = M4.scaling(Sx,Sx,Sx);
    var xRotationMatrix = M4.rotationX(deg2rad(Rx));
    var yRotationMatrix = M4.rotationY(deg2rad(Ry));
    var zRotationMatrix = M4.rotationZ(deg2rad(Rz));
    var translationMatrix = M4.translation(Tx,Ty,Tz);
    modelMatrix = M4.multiply(modelMatrix,zRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,yRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,xRotationMatrix);
    modelMatrix = M4.multiply(modelMatrix,translationMatrix);
    return modelMatrix;
}
var h = 0;
var h2 = 0;
const spread = [-2000,-1000,0,1000,2000];
function drawScene(now: number = 0, skip: boolean = false) {

    if(animation && !skip) {
        now *= 0.001;
        var delta = now-then;
        then = now;
        //lightLocation.rotate(deg2rad(rotationSpeed * delta),500,500);

        if(Math.abs(h2 - 1.2) > 0.0001) {
            if(Math.abs(h - 1.7) < 0.00001) {
                h2 += 0.1;
                surface.liftEdge(2,-h2);
                surface.liftEdge(1,h2/10);
                surface.construct(surface.precision);
            } else {
                h+=0.1;
                surface.liftEdge(3,-h);
                surface.construct(surface.precision);

            }
            surface.move(M4.translation(0,0,(h + h2) * 10));
        }

        if(keys["ArrowUp"]) {
            yCamera += 10;
            car.move(M4.translation(0,10,0));
            console.log(car.currentPosition);
        }
        if(keys["ArrowDown"]) {
            //yCamera -= 10;
            //car.move(M4.translation(0,-10,0));
            car.drive(20);
            console.log(car.currentPosition);
        }
        if(keys["ArrowRight"]) {
            car.rotate(3);
        }
        if(keys["ArrowLeft"]) {
            car.rotate(-3);
        }
    }

    if(!gl) throw new Error("webGL not supported");
    if(!bezierProgram) throw new Error("getProgramError");
    if(!carProgram) throw new Error("getProgramError");
    if(!roadProgram) throw new Error("getProgramError");
    if(!drawLightProgram) throw new Error("getProgramError");
    
    // View port setup
    setRenderingCanvas(gl,canvas);

    // Camera setup
    var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera);
    var cameraDirection: Vec3 = new Vec3(xCameraDirection,yCameraDirection,zCameraDirection);
    var cameraMatrix: M4 = getCameraMatrix(canvas, cameraPosition, cameraDirection);

    //console.log('Camera position:', xCamera,yCamera,zCamera);
    //console.log('Camera direction', xCameraDirection,yCameraDirection,zCameraDirection);

    //console.log('Translation', Tx, Ty, Tz);
    //console.log('Rotation', Rx, Ry, Rz);
    //console.log('Scale', Sx, Sy, Sz);

    car.draw(gl, carProgram, carAttributes, cameraMatrix, cameraPosition);

    spread.forEach(x => { road.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [x,0,0]); });

    brickWalls.forEach(wall => { wall.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition); });

    outsideWall.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition);
    outsideWall.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [2000,0,0]);
    outsideWall.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [-1000,0,0]);
    outsideWall.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [3000,0,0]);


    // fasade
    spread.forEach(x => { fasade.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [x,0,0]); });
    spread.forEach(x => { fasade.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [x,0,1000]); });

    // pavement
    for(var i:number = -1; i < 5; i++) {
        var dx:number = (-scale/4) * i;
        var dz:number = -scale/4;
        pavement.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, 0, 0]);
        pavement.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, dz, 0]);
        grass.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, 2 * dz, 0]);
        grass.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, 3 * dz, 0]);
    }

    for(var i:number = 0; i < 6; i++) {
        var dx:number = (scale/4) * i + scale;
        var dz:number = -scale/4;
        pavement.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, 0, 0]);
        pavement.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, dz, 0]);
        grass.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, 2 * dz, 0]);
        grass.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [ dx, 3 * dz, 0]);
    }

    for(var i:number = 0; i < 4; i++) {
        drivein.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [0, - i * scale /4 ,0]);
        drivein.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition, [scale/4, - i * scale / 4 ,0]);
    }

    // we are on the right track with this drawing, now we need to compress it so that draw car draws its lights as well
    carLights.forEach(light => { light.draw(gl, drawLightProgram, lightAttributes, cameraMatrix); });

    garageFloor.draw(gl, roadProgram, roadAttributes, cameraMatrix, cameraPosition);

    surface.draw(gl, bezierProgram, bezierAttributes, cameraMatrix, cameraPosition);
    //car.move(M4.translation(0,Ty,0));


    //hangar.draw(gl, hangarProgram, hangarAttributes, cameraMatrix, cameraPosition);
    //drawHangar(gl, hangarProgram, hangarAttributes, cameraMatrix, cameraPosition);

    //surface.modelMatrix = getModelMatrix();
    //surface.draw(gl, bezierProgram, bezierAttributes, cameraMatrix, cameraPosition);

    //leftRearLight.location.v1 = Tx;
    //leftRearLight.location.v2 = Ty;
    //leftRearLight.location.v3 = Tz;

    //leftRearLight.rotation.v1 = Rx;
    //leftRearLight.rotation.v2 = Ry;
    //leftRearLight.rotation.v3 = Rz;

    //leftRearLight.scale.v1 = Sx;
    //leftRearLight.scale.v2 = Sy;
    //leftRearLight.scale.v3 = Sz;
    

    if(animation && !skip) {
        animationID = requestAnimationFrame(drawScene);
    }
}

drawScene(0,true);