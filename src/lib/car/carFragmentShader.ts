export const carFragmentShader = `#version 300 es
precision mediump float;

#define NO_LIGHTS 10
#define FLAT_SHADING 0
#define GOURAUD_SHADING 1
#define PHONG_SHADING 2

in vec3 surfaceToLight[NO_LIGHTS];
in vec3 surfaceToEye;
in vec2 texCoord;
in vec3 fragmentNormal;

uniform vec3 u_lightColor[NO_LIGHTS];
uniform sampler2D u_texture;
uniform sampler2D u_normalTexture;
uniform float u_kd;
uniform float u_ks;
uniform float u_m;
uniform float u_fogAmount;
uniform int u_shadingMode;

uniform float u_kc;
uniform float u_kl;
uniform float u_kq;

out vec4 outputColor;

void main () {

  vec3 normal = normalize(fragmentNormal);

  if(u_shadingMode == FLAT_SHADING) {
    vec3 totalLight = vec3(0.0, 0.0, 0.0);

    for (int i = 0; i < NO_LIGHTS; i++) {
      float lightIntensity = max(dot(normalize(normal), normalize(surfaceToLight[i])), 0.0);
      totalLight += u_lightColor[i] * lightIntensity;
    }
    
    outputColor = texture(u_texture,texCoord);
    outputColor = vec4(outputColor.rgb * totalLight, outputColor.a);

  } else if(u_shadingMode == GOURAUD_SHADING) {
    
    vec3 totalLight = vec3(0.0);
    vec3 totalReflect = vec3(0.0);

    for(int i=0; i<NO_LIGHTS; i++) {
      
      float distance = length(surfaceToLight[i]);
      float attenuation = 1.0 / (u_kc + u_kl * distance + (u_kq * distance * distance));
      
      vec3 s2l = normalize(surfaceToLight[i]);
      vec3 s2e = normalize(surfaceToEye);
      vec3 halfVector = normalize(s2l + s2e);

      float diffuse = max(dot(normal, s2l), 0.1);

      totalLight += diffuse * u_lightColor[i] * attenuation;
    }

    outputColor = texture(u_texture,texCoord);
    outputColor.rgb *= (totalLight);

    outputColor = mix(outputColor, vec4(0.8,0.9,1.0,1.0), u_fogAmount);
  
  } else if(u_shadingMode == PHONG_SHADING) {


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

    outputColor = mix(outputColor, vec4(0.8,0.9,1.0,1.0), u_fogAmount);
  }
  
}`;