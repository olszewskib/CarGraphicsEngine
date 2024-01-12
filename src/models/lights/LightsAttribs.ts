export function LightsAttribs(gl: WebGL2RenderingContext, program: WebGLProgram) {
    // Attribute locations
    const a_vertex = gl.getAttribLocation(program, 'a_vertex');
    const a_color = gl.getAttribLocation(program, 'a_color');

    // Uniform locations
    const u_worldViewProjection = gl.getUniformLocation(program, 'u_worldViewProjection');

    return {
        a_vertex,
        a_color,
        u_worldViewProjection,
    }

}
