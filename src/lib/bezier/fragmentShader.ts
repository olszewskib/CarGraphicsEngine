
export const bezierFragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentNormal;
in vec3 surfaceToLight;
in vec3 fragmentColor;
in vec3 surfaceToEye;
in vec2 texCoord;

uniform float isNormalMapFS;
uniform sampler2D normalTex;
uniform vec3 u_lightColor;
uniform float isTexture;
uniform sampler2D tex;
uniform float u_kd;
uniform float u_ks;
uniform float u_m;

out vec4 outputColor;

void main() {

    // chcecking if there is a normal map
    vec3 normal;
    if(isNormalMapFS == 1.0) {
        normal = texture(normalTex,texCoord).rgb;
        normal = normalize(normal * 2.0 - 1.0);
    }
    else {
        normal = normalize(fragmentNormal);
    }

    // calculating the half vector in order to set the direction of light reflection
    vec3 s2l = normalize(surfaceToLight);
    vec3 s2e = normalize(surfaceToEye);
    vec3 halfVector = normalize(s2l + s2e);

    float light = dot(normal, s2l);
    float reflect = 0.0;
    if(light > 0.0) {
        reflect = pow(dot(normal, halfVector), u_m);
    }

    // checking if we should draw a texture or a normal color
    if(isTexture == 1.0) {
        outputColor = texture(tex,texCoord);
    }
    else {
        outputColor = vec4(fragmentColor, 1.0);
    }

    outputColor.rgb *= (light * u_lightColor * u_kd);
    outputColor.rgb += (reflect * u_lightColor * u_ks);
}`;