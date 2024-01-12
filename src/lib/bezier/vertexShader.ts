
export const bezierVertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec2 a_texcoord;
in vec3 a_tangent;
in vec4 a_vertex;
in vec3 a_normal;
in vec3 a_color;

uniform mat4 u_worldViewProjection;
uniform vec3 u_lightWorldPosition;
uniform float isNormalMapVS;
uniform vec3 u_eyePosition;
uniform mat4 u_world;

out vec3 surfaceToLight;
out vec3 fragmentNormal;
out vec3 fragmentColor;
out vec3 surfaceToEye;
out vec2 texCoord;

void main() {

    gl_Position = u_worldViewProjection * a_vertex;

    // normal
    vec3 N = normalize(vec3(u_world * vec4(a_normal, 0.0)));
    fragmentNormal = N;

    mat3 TBN;
    if(isNormalMapVS == 1.0) {
        vec3 T = normalize(vec3(u_world * vec4(a_tangent, 0.0)));
        T = normalize(T - dot(N,T) * N);
        vec3 B = cross(N,T);
        TBN = transpose(mat3(T,-B,N));    
    }

    // surface postion
    vec3 surfacePosition = (u_world * a_vertex).xyz;

    // directional lighting
    if(isNormalMapVS == 1.0) {
        surfaceToLight = TBN * normalize(u_lightWorldPosition - surfacePosition);
        surfaceToEye = TBN * normalize(u_eyePosition - surfacePosition);
    }
    else {
        surfaceToLight = normalize(u_lightWorldPosition - surfacePosition);
        surfaceToEye = normalize(u_eyePosition - surfacePosition);
    }

    // color of the vertex
    fragmentColor = a_color;

    // pass texture position to the fragment shadere
    texCoord = a_texcoord;
}`;