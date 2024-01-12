export function CarAttribs(gl: WebGL2RenderingContext, drawCarProgram: WebGLProgram) {
    const a_texcoord = gl.getAttribLocation(drawCarProgram, 'a_texcoord');
    const a_vertex = gl.getAttribLocation(drawCarProgram, 'a_vertex');
    const a_color = gl.getAttribLocation(drawCarProgram, 'a_color');

    const u_worldViewProjection = gl.getUniformLocation(drawCarProgram, 'u_worldViewProjection');

    return {
        a_texcoord,
        a_vertex,
        a_color,
        u_worldViewProjection
    }
}