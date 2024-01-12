export const carVertexShader = `#version 300 es

in vec2 a_texcoord;
in vec4 a_vertex;
in vec3 a_color;

uniform mat4 u_worldViewProjection;
 
out vec3 fragmentColor;
out vec3 v_normal;
out vec2 texCoord;

void main() {
  gl_Position = u_worldViewProjection * a_vertex;
  fragmentColor = a_color;
  texCoord = a_texcoord;
}
`;