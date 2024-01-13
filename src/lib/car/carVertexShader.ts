export const carVertexShader = `#version 300 es

#define NO_LIGHTS 5

in vec2 a_texcoord;
in vec4 a_vertex;
in vec3 a_normal;
in vec3 a_color;

uniform vec3 u_lightWorldPosition[NO_LIGHTS];
uniform mat4 u_worldViewProjection;
uniform vec3 u_eyePosition;
uniform mat4 u_world;
 
out vec3 surfaceToLight[NO_LIGHTS];
out vec3 fragmentNormal;
out vec3 fragmentColor;
out vec3 surfaceToEye;
out vec2 texCoord;

void main() {
  gl_Position = u_worldViewProjection * a_vertex;

  fragmentNormal = normalize(vec3(u_world * vec4(a_normal, 0.0)));

  vec3 surfacePosition = (u_world * a_vertex).xyz;
  surfaceToEye = normalize(u_eyePosition - surfacePosition);

  for(int i=0; i<NO_LIGHTS; i++) {
    surfaceToLight[i] = normalize(u_lightWorldPosition[i] - surfacePosition);
  }

  fragmentColor = a_color;
  texCoord = a_texcoord;
}
`;