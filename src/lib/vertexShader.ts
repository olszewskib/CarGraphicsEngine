
export const vertexShaderSourceCode = `#version 300 es
precision mediump float;

// vectors with input information
in vec4 vertexPosition;
in vec3 vertexNormal;
in vec3 vertexTangent;
in vec3 vertexColor;

// textures
in vec2 texPosition;

// matrix for transformations
uniform mat4 world;
uniform mat4 worldViewProjection;

// directional lighting
uniform vec3 lightPosition;
uniform vec3 eyePosition;

uniform float isNormalMapVS;

out vec3 fragmentColor;
out vec3 fragmentNormal;

out vec3 surfaceToLight;
out vec3 surfaceToEye;

out vec2 texCoord;


void main() {

    gl_Position = worldViewProjection * vertexPosition;

    // normal
    vec3 N = normalize(vec3(world * vec4(vertexNormal, 0.0)));
    fragmentNormal = N;

    mat3 TBN;
    if(isNormalMapVS == 1.0) {
        vec3 T = normalize(vec3(world * vec4(vertexTangent, 0.0)));
        T = normalize(T - dot(N,T) * N);
        vec3 B = cross(N,T);
        TBN = transpose(mat3(T,-B,N));    
    }

    // surface postion
    vec3 surfacePosition = (world * vertexPosition).xyz;

    // directional lighting
    if(isNormalMapVS == 1.0) {
        surfaceToLight = TBN * normalize(lightPosition - surfacePosition);
        surfaceToEye = TBN * normalize(eyePosition - surfacePosition);
    }
    else {
        surfaceToLight = normalize(lightPosition - surfacePosition);
        surfaceToEye = normalize(eyePosition - surfacePosition);
    }

    // color of the vertex
    fragmentColor = vertexColor;

    // pass texture position to the fragment shadere
    texCoord = texPosition;
}`;