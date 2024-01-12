export const carFragmentShader = `#version 300 es
precision mediump float;

in vec3 fragmentColor;
in vec2 texCoord;

uniform sampler2D tex;

out vec4 outputColor;

void main () {
  //outputColor = vec4(fragmentColor,1.0);
  outputColor = texture(tex,texCoord);

}`;