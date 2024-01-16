
export const bezierVertexShaderSourceCode = `#version 300 es
precision mediump float;

#define NO_LIGHTS 10

in vec4 a_vertex;
in vec2 a_texcoord;
in vec3 a_tangent;
in vec3 a_normal;
in vec3 a_color;

uniform vec3 u_lightWorldPosition[NO_LIGHTS];
uniform mat4 u_worldViewProjection;
uniform vec3 u_eyePosition;
uniform mat4 u_world;

out vec3 surfaceToLight[NO_LIGHTS];
out vec3 distanceToLight[NO_LIGHTS];
out vec3 surfaceToEye;
out vec2 texCoord;

void main() {

    gl_Position = u_worldViewProjection * a_vertex;

    // normal
    vec3 N = normalize(vec3(u_world * vec4(a_normal, 0.0)));

    mat3 TBN;
    vec3 T = normalize(vec3(u_world * vec4(a_tangent, 0.0)));
    T = normalize(T - dot(N,T) * N);
    vec3 B = cross(N,T);
    TBN = transpose(mat3(T,-B,N));    

    // surface postion
    vec3 surfacePosition = (u_world * a_vertex).xyz;
    surfaceToEye = TBN * normalize(u_eyePosition - surfacePosition);

    for(int i=0; i<NO_LIGHTS; i++) {
        distanceToLight[i] = u_lightWorldPosition[i] - surfacePosition;
        surfaceToLight[i] = TBN * normalize(u_lightWorldPosition[i] - surfacePosition);
    }

    texCoord = a_texcoord;
}`;