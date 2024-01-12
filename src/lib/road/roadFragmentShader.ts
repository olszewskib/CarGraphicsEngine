export const roadFragmentShader = `#version 300 es
precision mediump float;

#define NO_LIGHTS 3

in vec3 surfaceToLight[NO_LIGHTS];
in vec3 fragmentColor;
in vec3 surfaceToEye;
in vec2 texCoord;

uniform vec3 u_lightColor[NO_LIGHTS];
uniform sampler2D normalTex;
uniform sampler2D tex;
uniform float u_kd;
uniform float u_ks;
uniform float u_m;

out vec4 outputColor;

void main () {

  vec3 normal = texture(normalTex,texCoord).rgb;
  normal = normalize(normal * 2.0 - 1.0);
  normal.y = - normal.y;

  vec3 totalLight = vec3(0.0);
  vec3 totalReflect = vec3(0.0);

  for(int i=0; i<NO_LIGHTS; i++) {
    vec3 s2l = normalize(surfaceToLight[i]);
    vec3 halfVector = normalize(s2l + surfaceToEye);

    float light = max(dot(normal, s2l), 0.0);
    float reflect = pow(max(dot(normal, halfVector), 0.0), u_m);

    totalLight += light * u_lightColor[i];
    totalReflect += reflect * u_lightColor[i];
  }

  outputColor = texture(tex,texCoord);
  outputColor.rgb *= (totalLight * u_kd);
  outputColor.rgb += (totalReflect * u_ks);

}`;