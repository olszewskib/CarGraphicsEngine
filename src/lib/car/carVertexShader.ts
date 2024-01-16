export const carVertexShader = `#version 300 es

#define NO_LIGHTS 10

in vec4 a_vertex;
in vec2 a_texcoord;
in vec3 a_normal;

uniform vec3 u_lightWorldPosition[NO_LIGHTS];
uniform mat4 u_worldViewProjection;
uniform vec3 u_eyePosition;
uniform mat4 u_world;
 
out vec3 surfaceToLight[NO_LIGHTS];
out vec3 surfaceToEye;
out vec2 texCoord;
out vec3 fragmentNormal;

void main() {
  gl_Position = u_worldViewProjection * a_vertex;

  fragmentNormal = normalize(vec3(u_world * vec4(a_normal, 0.0)));

  vec3 surfacePosition = (u_world * a_vertex).xyz;
  surfaceToEye = normalize(u_eyePosition - surfacePosition);

  for(int i=0; i<NO_LIGHTS; i++) {
    surfaceToLight[i] = u_lightWorldPosition[i] - surfacePosition;
  }
  
  texCoord = a_texcoord;
}
`;