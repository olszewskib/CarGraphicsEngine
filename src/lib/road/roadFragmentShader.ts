export const roadFragmentShader = `#version 300 es
precision mediump float;

#define NO_LIGHTS 5

in vec3 surfaceToLight[NO_LIGHTS];
in vec3 surfaceToEye;
in vec2 texCoord;

uniform vec3 u_lightColor[NO_LIGHTS];
uniform sampler2D u_texture;
uniform sampler2D u_normalTexture;
uniform float u_kd;
uniform float u_ks;
uniform float u_m;

uniform float u_kc;
uniform float u_kl;
uniform float u_kq;

out vec4 outputColor;

void main () {

  vec3 normal = texture(u_normalTexture,texCoord).rgb;
  normal = normalize(normal * 2.0 - 1.0);
  normal.y = - normal.y;

  vec3 totalLight = vec3(0.0);
  vec3 totalReflect = vec3(0.0);

  for(int i=0; i<NO_LIGHTS; i++) {
    
    float distance = length(surfaceToLight[i]);
    float attenuation = 1.0 / (u_kc + u_kl * distance + (u_kq * distance * distance));
    
    vec3 s2l = normalize(surfaceToLight[i]);
    vec3 s2e = normalize(surfaceToEye);
    vec3 halfVector = normalize(s2l + s2e);

    float light = max(dot(normal, s2l), 0.0);
    float reflect = pow(max(dot(normal, halfVector), 0.0), u_m);

    totalLight += light * u_lightColor[i] * attenuation;
    totalReflect += reflect * u_lightColor[i] * attenuation;
  }

  outputColor = texture(u_texture,texCoord);
  outputColor.rgb *= (totalLight * u_kd);
  outputColor.rgb += (totalReflect * u_ks);

}`;