export function ObjAttribs(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const a_texcoord = gl.getAttribLocation(program, 'a_texcoord');
    const a_normal = gl.getAttribLocation(program, 'a_normal');
    const a_vertex = gl.getAttribLocation(program, 'a_vertex');
    const a_color = gl.getAttribLocation(program, 'a_color');

    const u_worldViewProjection = gl.getUniformLocation(program, 'u_worldViewProjection');
    const u_lightWorldPosition = gl.getUniformLocation(program, 'u_lightWorldPosition');
    const u_eyePosition = gl.getUniformLocation(program, 'u_eyePosition');
    const u_lightColor = gl.getUniformLocation(program, 'u_lightColor');
    const u_world = gl.getUniformLocation(program, 'u_world');
    const u_kd = gl.getUniformLocation(program, 'u_kd');
    const u_ks = gl.getUniformLocation(program, 'u_ks');
    const u_m = gl.getUniformLocation(program, 'u_m');

    return {
        a_texcoord,
        a_normal,
        a_vertex,
        a_color,
        u_worldViewProjection,
        u_lightWorldPosition,
        u_eyePosition,
        u_lightColor,
        u_world,
        u_kd,
        u_ks,
        u_m
    }
}