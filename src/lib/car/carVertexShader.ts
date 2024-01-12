export const carVertexShader = `#version 300 es

in vec2 a_texcoord;
in vec4 a_vertex;
in vec3 a_normal;
in vec3 a_color;

uniform mat4 u_worldViewProjection;
uniform vec3 u_lightWorldPosition;
uniform vec3 u_eyePosition;
uniform mat4 u_world;
 
out vec3 fragmentNormal;
out vec3 surfaceToLight;
out vec3 fragmentColor;
out vec3 surfaceToEye;
out vec3 v_normal;
out vec2 texCoord;

void main() {
  gl_Position = u_worldViewProjection * a_vertex;

  fragmentNormal = normalize(vec3(u_world * vec4(a_normal, 0.0)));

  vec3 surfacePosition = (u_world * a_vertex).xyz;

  surfaceToLight = normalize(u_lightWorldPosition - surfacePosition);
  surfaceToEye = normalize(u_eyePosition - surfacePosition);

  fragmentColor = a_color;
  texCoord = a_texcoord;
}
`;