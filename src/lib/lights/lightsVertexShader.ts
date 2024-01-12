export const lightsVertexShader = `#version 300 es

in vec4 a_vertex;
in vec3 a_color;

uniform mat4 u_worldViewProjection;
 
out vec3 fragmentColor;

void main() {
  gl_Position = u_worldViewProjection * a_vertex;
  fragmentColor = a_color;
}
`;