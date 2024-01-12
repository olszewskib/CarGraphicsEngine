export const roadFragmentShader = `#version 300 es
precision mediump float;

in vec3 surfaceToLight;
in vec3 fragmentColor;
in vec3 surfaceToEye;
in vec2 texCoord;

uniform sampler2D normalTex;
uniform vec3 u_lightColor;
uniform sampler2D tex;
uniform float u_kd;
uniform float u_ks;
uniform float u_m;

out vec4 outputColor;

void main () {

  vec3 normal = texture(normalTex,texCoord).rgb;
  //outputColor = vec4(normal, 1.0);
  normal = normalize(normal * 2.0 - 1.0);
  normal.y = - normal.y;

  vec3 s2l = normalize(surfaceToLight);
  vec3 s2e = normalize(surfaceToEye);
  vec3 halfVector = normalize(s2l + s2e);

  float light = dot(normal, s2l);
  float reflect = 0.0;
  reflect = pow(dot(normal, halfVector), u_m);
  if(light > 0.0) {
  }

  outputColor = texture(tex,texCoord);
  outputColor.rgb *= (light * u_lightColor * u_kd);
  outputColor.rgb += (reflect * u_lightColor * u_ks);

}`;