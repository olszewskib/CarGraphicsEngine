
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

export function setRenderingCanvas(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
}

export function createTexture(gl: WebGL2RenderingContext,
    program: WebGLProgram,
    tex: HTMLImageElement,
    normalMap: HTMLImageElement,
    ) {
    
    gl.useProgram(program);

    // loading texture
     var texture = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D,texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);

     // loading normal map
     var normalTexture = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D,normalTexture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

     gl.bindTexture(gl.TEXTURE_2D, normalTexture);
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, normalMap);

     return [texture,normalTexture];
}

export class GlAttributes {
    
    // Attribute locations
    readonly a_texcoord: number;
    readonly a_tangent: number;
    readonly a_normal: number; 
    readonly a_vertex: number;
    readonly a_color: number;

    // Uniform locations
    readonly u_worldViewProjection: WebGLUniformLocation | null;
    readonly isNormalMapFSLocation: WebGLUniformLocation | null;
    readonly u_lightWorldPosition: WebGLUniformLocation | null;
    readonly isNormalMapVSLocation: WebGLUniformLocation | null;
    readonly isTextureLocation: WebGLUniformLocation | null;
    readonly u_eyePosition: WebGLUniformLocation | null;
    readonly u_lightColor: WebGLUniformLocation | null;
    readonly u_world: WebGLUniformLocation | null;
    readonly u_kd: WebGLUniformLocation | null;
    readonly u_ks: WebGLUniformLocation | null; 
    readonly u_m: WebGLUniformLocation | null;
    readonly u_kc: WebGLUniformLocation | null;
    readonly u_kl: WebGLUniformLocation | null; 
    readonly u_kq: WebGLUniformLocation | null;
    readonly u_texture: WebGLUniformLocation | null;
    readonly u_normalTexture: WebGLUniformLocation | null;

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {

        // Attribute locations
        this.a_texcoord = gl.getAttribLocation(program, 'a_texcoord');
        this.a_tangent = gl.getAttribLocation(program, 'a_tangent');
        this.a_normal = gl.getAttribLocation(program, 'a_normal');
        this.a_vertex = gl.getAttribLocation(program, 'a_vertex');
        this.a_color = gl.getAttribLocation(program, 'a_color');

        // Uniform locations
        this.u_worldViewProjection = gl.getUniformLocation(program, 'u_worldViewProjection');
        this.u_lightWorldPosition = gl.getUniformLocation(program, 'u_lightWorldPosition');
        this.isNormalMapFSLocation = gl.getUniformLocation(program, 'isNormalMapFS');
        this.isNormalMapVSLocation = gl.getUniformLocation(program, 'isNormalMapVS');
        this.u_eyePosition = gl.getUniformLocation(program, 'u_eyePosition');
        this.isTextureLocation = gl.getUniformLocation(program, 'isTexture');
        this.u_lightColor = gl.getUniformLocation(program, 'u_lightColor');
        this.u_world = gl.getUniformLocation(program, 'u_world');
        this.u_kd = gl.getUniformLocation(program, 'u_kd');
        this.u_ks = gl.getUniformLocation(program, 'u_ks');
        this.u_m = gl.getUniformLocation(program, 'u_m');
        this.u_kc = gl.getUniformLocation(program, 'u_kc');
        this.u_kl = gl.getUniformLocation(program, 'u_kl');
        this.u_kq = gl.getUniformLocation(program, 'u_kq');
        this.u_texture = gl.getUniformLocation(program, 'u_texture');
        this.u_normalTexture = gl.getUniformLocation(program, 'u_normalTexture');
    }

}