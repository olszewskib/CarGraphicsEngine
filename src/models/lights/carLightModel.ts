export class CarLightModel {

    precision: number;
    height: number;
    radius: number;
    vertices: number[];
    bufferData: Float32Array;

    constructor(precision: number, height: number, radius: number = 1) {
        this.precision = precision;
        this.height = height;
        this.radius = radius;
        this.vertices = [];
        this.bufferData = new Float32Array([]);
    }

    createSphereArrayBuffer(segments: number, rings: number) {
        const vertexData = [];
    
        for (var latNumber = 0; latNumber < rings; latNumber++) {
            for (var longNumber = 0; longNumber < segments; longNumber++) {
                const theta = [latNumber, latNumber + 1].map(val => val * Math.PI / rings);
                const phi = [longNumber, longNumber + 1].map(val => val * 2 * Math.PI / segments);
    
                const vertices = [];
                for (var i = 0; i < 2; i++) {
                    for (var j = 0; j < 2; j++) {
                        const sinTheta = Math.sin(theta[i]);
                        const cosTheta = Math.cos(theta[i]);
    
                        const sinPhi = Math.sin(phi[j]);
                        const cosPhi = Math.cos(phi[j]);
    
                        vertices.push(this.radius * cosPhi * sinTheta); // x
                        vertices.push(this.radius * cosTheta); // y
                        vertices.push(this.radius * sinPhi * sinTheta); // z
                    }
                }
    
                // First triangle
                vertexData.push(...vertices.slice(0, 3), ...vertices.slice(3, 6), ...vertices.slice(6, 9));
                // Second triangle
                vertexData.push(...vertices.slice(3, 6), ...vertices.slice(9, 12), ...vertices.slice(6, 9));
            }
        }
    
        this.bufferData = new Float32Array(vertexData);
    }

}