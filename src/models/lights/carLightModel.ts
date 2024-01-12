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


    consturctSphere(rings:number, segments:number):void {

        for (let latNumber = 0; latNumber <= rings / 2; latNumber++) { // Half the number of rings
            const theta = latNumber * Math.PI / rings;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
        
            for (let longNumber = 0; longNumber <= segments; longNumber++) {
                const phi = longNumber * 2 * Math.PI / segments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
        
                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;
        
                // Add vertices for upper hemisphere
                this.vertices.push(this.radius * x);
                this.vertices.push(this.radius * y);
                this.vertices.push(this.radius * z);
            }
        }
        
        this.bufferData = new Float32Array(this.vertices);
    }

    construct():void {
        var angle:number =  (360 / this.precision) * (Math.PI / 180);
        var x  = 0;
        var y = this.radius;

        for(var i:number = 0; i < this.precision; i++) {
            
            var rot1 = angle * i;

            var x1 = x * Math.cos(rot1) - y * Math.sin(rot1);
            var y1 = y * Math.cos(rot1) + x * Math.sin(rot1);
            
            this.vertices.push(x1);
            this.vertices.push(y1);
            this.vertices.push(0);

            this.vertices.push(0);
            this.vertices.push(0);
            this.vertices.push(this.height);

            var rot2 = angle * (i + 1);

            var x3 = x * Math.cos(rot2) - y * Math.sin(rot2);
            var y3 = y * Math.cos(rot2) + x * Math.sin(rot2);

            this.vertices.push(x3);
            this.vertices.push(y3);
            this.vertices.push(0);


        }

        this.bufferData = new Float32Array(this.vertices);
    }


    createSphereArrayBuffer(segments: number, rings: number) {
        const vertexData = [];
    
        for (let latNumber = 0; latNumber < rings; latNumber++) {
            for (let longNumber = 0; longNumber < segments; longNumber++) {
                const theta = [latNumber, latNumber + 1].map(val => val * Math.PI / rings);
                const phi = [longNumber, longNumber + 1].map(val => val * 2 * Math.PI / segments);
    
                const vertices = [];
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
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