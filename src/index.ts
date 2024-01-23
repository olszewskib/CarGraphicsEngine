import { BezierSurface, getColors, getNormals, getTangents, getTexture, getVertices } from "./models/bezier/BezierSurface";
import { GlAttributes, createTexture, getProgram, setRenderingCanvas } from "./webGL";
import { bezierFragmentShaderSourceCode } from "./lib/bezier/fragmentShader";
import { bezierVertexShaderSourceCode } from "./lib/bezier/vertexShader";
import { lightsFragmentShader } from "./lib/lights/lightsFragmentShader";
import { BezierSurfaceModel } from "./models/bezier/BezierSurfaceModel";
import { lightsVertexShader } from "./lib/lights/lightsVertexShader";
import { tileFragmentShader } from "./lib/tile/tileFragmentShader";
import { carFragmentShader } from "./lib/car/carFragmentShader";
import { tileVertexShader } from "./lib/tile/tileVertexShader";
import { CarLightModel } from "./models/lights/carLightModel";
import { carVertexShader } from "./lib/car/carVertexShader";
import { Camera } from "./models/camera/camera";
import { deg2rad } from "./models/math/angles";
import { Vec3 } from "./models/math/vec3";
import { OBJParser } from "./models/parser/objParser";
import { M4 } from "./models/math/m4";
import { CarLight } from "./models/lights/carLight";
import { TileModel } from "./models/tile/tileModel";
import { Tile } from "./models/tile/tile";
import { ObjModel } from "./models/objModel";
import { Car } from "./models/car/car";
import { SceneLight } from "./models/lights/sceneLight";
import { Textures } from "./textures";
import { Lamp } from "./models/lamp/lamp";
import { ColorModel } from "./models/colors/colorModel";
import { IRenderObject } from "./models/renderObject";

const zSlider = document.getElementById("zSlider") as HTMLInputElement;
const xIndex = document.getElementById("xIndexInput") as HTMLInputElement;
const yIndex = document.getElementById("yIndexInput") as HTMLInputElement;

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
    colorModel.kd = kd;
    drawScene(0,true);
})
ksSlider.addEventListener("input", function() {
    ks = parseFloat(ksSlider.value);
    colorModel.ks = ks;
    drawScene(0,true);
})
mirrorSlider.addEventListener("input", function() {
    mirror = parseInt(mirrorSlider.value,10);
    colorModel.m = mirror;
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

var dayButton = document.getElementById("day") as HTMLButtonElement;
var nightButton = document.getElementById("night") as HTMLButtonElement;
if(dayButton == null || nightButton == null) {
    throw new Error("animationError");
}

var isNight: boolean = true;

dayButton.addEventListener("click", function() {
    sun.intensity = 450;
    drawScene(0,true);
})

nightButton.addEventListener("click", function() {
    sun.intensity = 0;
    drawScene(0, true);
})

var goruaudButton = document.getElementById("goruaud") as HTMLButtonElement;
var phongButton = document.getElementById("phong") as HTMLButtonElement;
if(goruaudButton == null || phongButton == null) {
    throw new Error("animationError");
}

goruaudButton.addEventListener("click", function() {
    colorModel.shadingMode = 1;
    drawScene(0,true);
})

phongButton.addEventListener("click", function() {
    colorModel.shadingMode = 2;
    drawScene(0,true);
})

var fogOnButton = document.getElementById("fogOn") as HTMLButtonElement;
var fogOffButton = document.getElementById("fogOff") as HTMLButtonElement;
if(fogOnButton == null || fogOffButton == null) {
    throw new Error("animationError");
}

fogOnButton.addEventListener("click", function() {
    colorModel.isFog = true;
})

fogOffButton.addEventListener("click", function() {
    colorModel.isFog = false;
})

var staticCameraButton = document.getElementById("static") as HTMLButtonElement;
var followCameraButton = document.getElementById("follow") as HTMLButtonElement;
var gameCameraButton = document.getElementById("game") as HTMLButtonElement;
if(staticCameraButton == null || followCameraButton == null || gameCameraButton == null) {
    throw new Error("cameraError");
}

var cameraMode: string = "static";
staticCameraButton.addEventListener("click", function() {
    cameraMode = "static";
    if(!loading) objectToRender.forEach(obj => { obj.setInitialModelMatrix(); })
    if (!loading) car.setInitialModelMatrix();
    if (!loading) car.carLights.forEach(light => { light.setInitialModelMatrix(); });
    drawScene(0,true);
})

followCameraButton.addEventListener("click", function() {
    cameraMode = "follow";
    if(!loading) objectToRender.forEach(obj => { obj.setInitialModelMatrix(); })
    if (!loading) car.setInitialModelMatrix();
    if (!loading) car.carLights.forEach(light => { light.setInitialModelMatrix(); });
    drawScene(0,true);
})

gameCameraButton.addEventListener("click", function() {
    cameraMode = "game";
    if(!loading) objectToRender.forEach(obj => { obj.setInitialModelMatrix(); })
    if (!loading) car.setInitialModelMatrix();
    if (!loading) car.carLights.forEach(light => { light.setInitialModelMatrix(); });
    drawScene(0,true);
})

// ------------------------------------------------------------------------- Flags ---------------------------

var lightLocation: Vec3 = new Vec3(xLightLocation,yLightLocation,zLightLocation);

// animation;
var animation: boolean = false;
var then = 0;
var animationID: number;

var objectToRender: IRenderObject[] = [];

// ------------------------------------------------------------------------- Textures ----------------------------------------------

var bezierTexture = await Textures.fetchTexture('resources/obj/city/garage/door/door.jpg');
var bezierNormalMap = await Textures.fetchTexture('resources/obj/city/garage/door/doorNormal.jpg');
var carTexture = await Textures.fetchTexture('resources/obj/porsche/textures/paintedMetal.jpg');
var roadTexture = await Textures.fetchTexture('resources/obj/road/rd.png');
var roadNormalMap = await Textures.fetchTexture('resources/obj/road/rdn.png');
var wallTexture = await Textures.fetchTexture('resources/obj/city/wall/brick.png');
var wallNormalMap = await Textures.fetchTexture('resources/obj/city/wall/brickNormal.png');
var garageTexture = await Textures.fetchTexture('resources/obj/city/garage/garage.png');
var garageNormalMap = await Textures.fetchTexture('resources/obj/city/garage/garageNormal.png');
var cityTexture = await Textures.fetchTexture('resources/obj/city/city.jpg');
var cityNormalMap = await Textures.fetchTexture('resources/obj/city/cityNormal.png');
var pavementTexture = await Textures.fetchTexture('resources/obj/city/pavement/pavement.png');
var pavementNormalMap = await Textures.fetchTexture('resources/obj/city/pavement/pavementNormal.png');
var driveinTexture = await Textures.fetchTexture('resources/obj/city/drivein/drivein.png');
var driveinNormalMap = await Textures.fetchTexture('resources/obj/city/drivein/driveinNormal.png');
var grassTexture = await Textures.fetchTexture('resources/obj/city/grass/grass.png');
var grassNormalMap = await Textures.fetchTexture('resources/obj/city/grass/grassNormal.png');

var carNormalMap = roadNormalMap;

console.log('Textures loaded');

// ------------------------------------------------------------------------ ColorModel ----------------------------------------------

var colorModel = new ColorModel(mirror,ks,kd);

// ------------------------------------------------------------------------ Canvas ----------------------------------------------

const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
if(!canvas) throw new Error("Cant find canvas");

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

var keys: { [key: string]: boolean } = {};
canvas.addEventListener("keydown", function(event) { keys[event.key] = true; })
canvas.addEventListener("keyup", function(event) { keys[event.key] = false; })

// ------------------------------------------------------------------------ Camera ----------------------------------------------

var cameraPosition: Vec3 = new Vec3(xCamera,yCamera,zCamera);
var cameraDirection: Vec3 = new Vec3(xCameraDirection,yCameraDirection,zCameraDirection);
var camera = new Camera(cameraPosition,cameraDirection,canvasWidth,canvasHeight);

// ------------------------------------------------------------------------ GL -----------------------------------------

export const gl = canvas.getContext('webgl2');
if(!gl) throw new Error("webGL not supported");

// ------------------------------------------------------------------------- Lights ----------------------------------------------

var sceneLight = new SceneLight(lightLocation, 10, new Vec3(255,255,255));
var sun = new SceneLight(new Vec3(0,-2000,10000),0, new Vec3(255,255,255));

const lightMesh = new CarLightModel(20,1);
lightMesh.createSphereArrayBuffer(30,15);

var rightHeadLight = new CarLight(new Vec3(376,157,128),new Vec3(118,186,0),new Vec3(24,15,43), new Vec3(255,255,0), lightMesh, camera);
var leftHeadLight = new CarLight(new Vec3(626,144,127),new Vec3(121,360,176),new Vec3(28,12,41), new Vec3(255,255,0), lightMesh, camera);
var rightRearLight = new CarLight(new Vec3(376,876,127),new Vec3(0,0,61),new Vec3(50,26,11), new Vec3(255,0,0), lightMesh, camera); 
var leftRearLight = new CarLight(new Vec3(626,876,127),new Vec3(0,0,298),new Vec3(50,26,11), new Vec3(255,0,0), lightMesh, camera); 

var carLights = [rightHeadLight,leftHeadLight,rightRearLight,leftRearLight];
var staticLights = [sceneLight,sun];
var worldLights = [...carLights, sceneLight,sun];

const drawLightProgram = getProgram(gl,lightsVertexShader,lightsFragmentShader);
if(!drawLightProgram) throw new Error("getProgramError");

const lightAttributes = new GlAttributes(gl,drawLightProgram);

// ------------------------------------------------------------------------ Bezier Surface -------------------------------

const bezierProgram = getProgram(gl,bezierVertexShaderSourceCode,bezierFragmentShaderSourceCode);
if(!bezierProgram) throw new Error("getProgramError");
const bezierAttributes = new GlAttributes(gl,bezierProgram);

const surfaceModel = new BezierSurfaceModel();

var bezierTextures = createTexture(gl,bezierProgram,bezierTexture,bezierNormalMap);
if(bezierTextures[0] == null || bezierTextures[1] == null) throw new Error("textureError");

var precision: number = 20;
const surface = new BezierSurface(
    precision,surfaceModel,
    worldLights,
    bezierTextures[0],
    bezierTextures[1], 
    colorModel,
    camera
    );

var triangleVertices = getVertices(surface);
var triangleNormals = getNormals(surface);
var triangleTangents = getTangents(surface);
var rgbTriangleColors = getColors(surface);
var textureCoords = getTexture(surface);

objectToRender.push(surface);

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


var carTextures = createTexture(gl,carProgram,carTexture,carNormalMap);
if(carTextures[0] == null || carTextures[1] == null) throw new Error("textureError");

var carModel = new ObjModel(carObjModel.verticesBuffer,
        carObjModel.normalsBuffer,
        carObjModel.textureBuffer,
        carTextures[0],
        carTextures[1],
        colorModel
    );

var car = new Car(carModel,worldLights,carLights,camera);

const carAttributes = new GlAttributes(gl,carProgram);

// ------------------------------------------------------------------------- Street lamps --------------------------------

const lampObjUrl = 'resources/obj/lamp/lamp.obj';
var lampObjModel = new OBJParser();

await fetch(lampObjUrl).then(response => response.text())
    .then(objContent => {
        lampObjModel.parse(objContent);
    })
    .catch(error => {
        console.error('Error fetching the OBJ file:', error);
    });

const lampProgram = getProgram(gl,carVertexShader,carFragmentShader);
if(!lampProgram) throw new Error("getProgramError");
var lampAttributes = new GlAttributes(gl,lampProgram);

var lampModel = new ObjModel(lampObjModel.verticesBuffer,
        lampObjModel.normalsBuffer,
        lampObjModel.textureBuffer,
        carTextures[0],
        carTextures[1],
        colorModel
    );

var lamp1 = new Lamp(lampModel,worldLights, M4.getInitMatirx(new Vec3(-430, -785,0), new Vec3(90,270,0), new Vec3(200,200,200)),new Vec3(-430,-785,700),7,new Vec3(255,255,255),camera);
var lamp2 = new Lamp(lampModel,worldLights, M4.getInitMatirx(new Vec3(1460, -785,0), new Vec3(90,270,0), new Vec3(200,200,200)),new Vec3(1460,-785,700),7,new Vec3(255,255,255),camera);
objectToRender.push(lamp1);
objectToRender.push(lamp2);
staticLights.push(lamp1);
staticLights.push(lamp2);

// ------------------------------------------------------------------------- Road --------------------------------

const scale = 1000;
const spread = [-2000,-1000,0,1000,2000];

const roadProgram = getProgram(gl,tileVertexShader,tileFragmentShader);
if(!roadProgram) throw new Error("getProgramError");
const roadAttributes = new GlAttributes(gl,roadProgram);

var roadTextures = createTexture(gl,roadProgram, roadTexture, roadNormalMap);
if(roadTextures[0] == null || roadTextures[1] == null) throw new Error("textureError");

var road: Tile[] = [];
var roadModel = new TileModel(triangleVertices,textureCoords,roadTextures[0],roadTextures[1],colorModel);
spread.forEach(x => { road.push(new Tile(roadModel, worldLights, M4.getInitMatirx(new Vec3(x,-scale * 2,0), new Vec3(0,0,0), new Vec3(scale,scale,scale)), camera)); });
objectToRender.push(...road);

// ------------------------------------------------------------------------- Garage --------------------------------

var wallTextures = createTexture(gl,roadProgram, wallTexture, wallNormalMap);
if(wallTextures[0] == null || wallTextures[1] == null) throw new Error("textureError");

var wallModel = new TileModel(triangleVertices,textureCoords,wallTextures[0],wallTextures[1],colorModel);
var backWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(0,1000,0), new Vec3(90,0,0), new Vec3(scale,scale/2,scale)), camera);
var leftWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(0,0,0), new Vec3(90,90,0), new Vec3(scale,scale/2,scale)), camera);
var rightWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(1000,1000,0), new Vec3(90,270,0), new Vec3(scale,scale/2,scale)), camera);
var topWall = new Tile(wallModel,worldLights, M4.getInitMatirx(new Vec3(0,scale,scale/2), new Vec3(180,0,0), new Vec3(scale,scale,scale)), camera);

var garageTextures = createTexture(gl,roadProgram, garageTexture, garageNormalMap);
if(garageTextures[0] == null || garageTextures[1] == null) throw new Error("textureError");

var garageModel = new TileModel(triangleVertices,textureCoords,garageTextures[0],garageTextures[1],colorModel);
var garageFloor = new Tile(garageModel,worldLights, M4.getInitMatirx(new Vec3(0,0,0), new Vec3(0,0,0), new Vec3(scale,scale,scale)), camera);

var garage = [backWall,leftWall,rightWall,topWall,garageFloor];
objectToRender.push(...garage);

// ------------------------------------------------------------------------- Fasade --------------------------------

var fasade: Tile[] = [];
spread.forEach(x => { if(x != 0) fasade.push(new Tile(wallModel, worldLights, M4.getInitMatirx(new Vec3(x,0,0), new Vec3(90,0,0), new Vec3(scale,scale/2,scale)), camera)); });

var cityTextures = createTexture(gl,roadProgram, cityTexture, cityNormalMap);
if(cityTextures[0] == null || cityTextures[1] == null) throw new Error("textureError");

var cityModel = new TileModel(triangleVertices,textureCoords,cityTextures[0],cityTextures[1],colorModel);
spread.forEach(x => { fasade.push(new Tile(cityModel, worldLights, M4.getInitMatirx(new Vec3(x + scale,0,scale + scale / 2), new Vec3(90,0,180), new Vec3(scale,scale,scale)), camera)); });
spread.forEach(x => { fasade.push(new Tile(cityModel, worldLights, M4.getInitMatirx(new Vec3(x + scale,0,scale + scale + scale / 2), new Vec3(90,0,180), new Vec3(scale,scale,scale)), camera)); });
objectToRender.push(...fasade);

// ------------------------------------------------------------------------- Pavement --------------------------------

var pavement: Tile[] = [];
var grass: Tile[] = [];
var driveIn: Tile[] = [];

var pavementTextures = createTexture(gl,roadProgram, pavementTexture, pavementNormalMap);
if(pavementTextures[0] == null || pavementTextures[1] == null) throw new Error("textureError");

var grassTextures = createTexture(gl,roadProgram, grassTexture, grassNormalMap);
if(grassTextures[0] == null || grassTextures[1] == null) throw new Error("textureError");

var driveinTextures = createTexture(gl,roadProgram, driveinTexture, driveinNormalMap);
if(driveinTextures[0] == null || driveinTextures[1] == null) throw new Error("textureError");

var pavementModel = new TileModel(triangleVertices,textureCoords,pavementTextures[0],pavementTextures[1],colorModel);
var grassModel = new TileModel(triangleVertices,textureCoords,grassTextures[0],grassTextures[1],colorModel);
var driveinModel = new TileModel(triangleVertices,textureCoords,driveinTextures[0],driveinTextures[1],colorModel);

for(var i:number = 0; i < 8; i++) {
    var dx:number = (scale/4) * i + scale;
    var dz:number = -scale/4;
    pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(-3* scale + dx,dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(-3 * scale +dx,2* dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(dx,dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(dx,2* dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(-3* scale + dx,3*dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(-3 * scale +dx,4* dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(dx,3*dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
    grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(dx,4*dz,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
}
pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(0,-scale/4,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(0,-scale/2,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(3 * scale/4,-scale/4,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
pavement.push(new Tile(pavementModel,worldLights, M4.getInitMatirx(new Vec3(3 * scale/4,-scale/2,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(0,-scale/4 *3,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(0,-scale,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(3 * scale/4,-scale/4 *3,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));
grass.push(new Tile(grassModel,worldLights, M4.getInitMatirx(new Vec3(3 * scale/4,-scale,0), new Vec3(0,0,0), new Vec3(scale/4,scale/4,scale/4)), camera));

for(var i:number = 1; i < 5; i++) {
    driveIn.push(new Tile(driveinModel,worldLights, M4.getInitMatirx(new Vec3(scale/2,- i * scale / 4,0), new Vec3(0,0,90), new Vec3(scale/4,scale/4,scale/4)), camera));
    driveIn.push(new Tile(driveinModel,worldLights, M4.getInitMatirx(new Vec3(scale/4 * 3,- i * scale / 4,0), new Vec3(0,0,90), new Vec3(scale/4,scale/4,scale/4)), camera));
}

objectToRender.push(...pavement);
objectToRender.push(...grass);
objectToRender.push(...driveIn);

// ------------------------------------------------------------------------- Drawing ------------------------

var h = 0;
var h2 = 0;
var loading = true;
function drawScene(now: number = 0, skip: boolean = false) {

    if(animation && !skip) {
        
        now *= 0.001;
        var delta = now-then;
        then = now;

        if(colorModel.isFog && colorModel.fogAmount < 0.7) {
            colorModel.fogAmount += 0.01;
        } else if(!colorModel.isFog && colorModel.fogAmount > 0.0) {
            colorModel.fogAmount -= 0.01;
        }

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
            surface.cachedModelMatrix = surface.modelMatrix;
        } else {
            loading = false;
        }

        if(keys["ArrowDown"]) {
            //yCamera += 10;
            //car.move(M4.translation(0,10,0));
        }
        if(keys["ArrowUp"]) {
            if(camera.isGameCamera) {
                var distance = 20;
                var dx = Math.cos(deg2rad(car.rotation)) * distance;
                var dy = Math.sin(deg2rad(car.rotation)) * distance;
                objectToRender.forEach(obj => { obj.modelMatrix = M4.multiply(obj.modelMatrix, M4.translation(dy,dx,0)); });
            } else {
                car.drive(20);
            }
        }
        if(keys["ArrowRight"]) {
            if(camera.isGameCamera) {
                objectToRender.forEach(obj => { obj.modelMatrix = M4.multiply(obj.modelMatrix, M4.rotationZ(deg2rad((3)))); });
            } else {
                car.rotate(3);
            }
        }
        if(keys["ArrowLeft"]) {
            if(camera.isGameCamera) {
                objectToRender.forEach(obj => { obj.modelMatrix = M4.multiply(obj.modelMatrix, M4.rotationZ(deg2rad((-3)))); });
            } else {
                car.rotate(-3);
            }
        }
    }

    if(!gl) throw new Error("webGL not supported");
    if(!bezierProgram) throw new Error("getProgramError");
    if(!carProgram) throw new Error("getProgramError");
    if(!roadProgram) throw new Error("getProgramError");
    if(!drawLightProgram) throw new Error("getProgramError");
    if(!lampProgram) throw new Error("getProgramError");
    
    // View port setup
    setRenderingCanvas(gl,canvas);

    switch(cameraMode) {
        case "static":
            camera.static();
            break;
        case "follow":
            camera.followCar(car);
            break;
        case "game":
            camera.gameCamera(car);
            break;
    }

    car.draw(gl, carProgram, carAttributes);
    carLights.forEach(light => { light.draw(gl, drawLightProgram, lightAttributes); });
    surface.draw(gl, bezierProgram, bezierAttributes);

    road.forEach(tile => { tile.draw(gl, roadProgram, roadAttributes); });
    garage.forEach(tile => { tile.draw(gl, roadProgram, roadAttributes); });
    fasade.forEach(tile => { tile.draw(gl, roadProgram, roadAttributes); });
    pavement.forEach(tile => { tile.draw(gl, roadProgram, roadAttributes); });
    grass.forEach(tile => { tile.draw(gl, roadProgram, roadAttributes); });
    driveIn.forEach(tile => { tile.draw(gl, roadProgram, roadAttributes); });
    lamp1.draw(gl, lampProgram, lampAttributes);
    lamp2.draw(gl, lampProgram, lampAttributes);


    if(animation && !skip) {
        animationID = requestAnimationFrame(drawScene);
    }
}

drawScene(0,true);