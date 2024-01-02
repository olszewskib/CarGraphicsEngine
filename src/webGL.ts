
export function getProgram(gl: WebGL2RenderingContext, vertexShaderSourceCode: string, fragmentShaderSourceCode: string) {

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if(!vertexShader) return null;
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        console.log(errorMessage);
        return null;
    }
  
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if(!fragmentShader) return null;
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        console.log(errorMessage);
        return null;
    } 

    const program = gl.createProgram();
    if(!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(program);
        console.log(errorMessage);
        return null;
    }

    return program;
}

export function createStaticVertexBuffer(gl: WebGL2RenderingContext, data: ArrayBuffer) {
    const buffer = gl.createBuffer();
    if(!buffer) {
        throw new Error('BufferCreationError');
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return buffer;
}