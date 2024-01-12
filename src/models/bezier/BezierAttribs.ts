export function BezierAttribs(gl: WebGL2RenderingContext, program: WebGLProgram) {
    // Attribute locations
    const a_texcoord = gl.getAttribLocation(program, 'a_texcoord');
    const a_tangent = gl.getAttribLocation(program, 'a_tangent');
    const a_normal = gl.getAttribLocation(program, 'a_normal');
    const a_vertex = gl.getAttribLocation(program, 'a_vertex');
    const a_color = gl.getAttribLocation(program, 'a_color');

    // Uniform locations
    const u_worldViewProjection = gl.getUniformLocation(program, 'u_worldViewProjection');
    const u_lightWorldPosition = gl.getUniformLocation(program, 'u_lightWorldPosition');
    const isNormalMapFSLocation = gl.getUniformLocation(program, 'isNormalMapFS');
    const isNormalMapVSLocation = gl.getUniformLocation(program, 'isNormalMapVS');
    const u_eyePosition = gl.getUniformLocation(program, 'u_eyePosition');
    const isTextureLocation = gl.getUniformLocation(program, 'isTexture');
    const u_lightColor = gl.getUniformLocation(program, 'u_lightColor');
    const u_world = gl.getUniformLocation(program, 'u_world');
    const u_kd = gl.getUniformLocation(program, 'u_kd');
    const u_ks = gl.getUniformLocation(program, 'u_ks');
    const u_m = gl.getUniformLocation(program, 'u_m');

    return {
        a_texcoord,
        a_tangent,
        a_normal,
        a_vertex,
        a_color,
        u_worldViewProjection,
        u_lightWorldPosition,
        isNormalMapFSLocation,
        isNormalMapVSLocation,
        u_eyePosition,
        isTextureLocation,
        u_lightColor,
        u_world,
        u_kd,
        u_ks,
        u_m
    }

}
