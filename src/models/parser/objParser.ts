export class OBJParser {
    cVertices: string[][] = [];
    cTextures: string[][] = [];
    cNormals: string[][] = [];
    faces: number[][] = [];
    vertices: number[] = [];
    textures: number[] = [];
    normals: number[] = [];
    verticesBuffer: Float32Array = new Float32Array();
    normalsBuffer: Float32Array = new Float32Array();
    textureBuffer: Float32Array = new Float32Array();

    parse(objContent: string) {
        const lines = objContent.split("\n");

        for (var line of lines) {
            const parts = line.trim().split(/\s+/);
            switch (parts[0]) {
                case "v":
                    this.cVertices.push(parts.slice(1));
                    break;
                case "vt":
                    this.cTextures.push(parts.slice(1));
                    break;
                case "vn":
                    this.cNormals.push(parts.slice(1));
                    break;
                case "f":
                    const face = parts.slice(1).map(part => {
                        // Each part is like "vertex/texture/normal"
                        return part.split("/").map(numStr => parseInt(numStr) - 1); // OBJ indices are 1-based
                    });

                    if (face.length == 4) {
                        // If it's a quad, split it into two triangles
                        const [v1, v2, v3, v4] = face;
                
                        // First triangle: v1, v2, v3
                        [v1, v2, v3].forEach(([v, t, n]) => {
                            this.vertices.push(...this.cVertices[v].map(Number));
                            this.textures.push(...this.cTextures[t].map(Number));
                            this.normals.push(...this.cNormals[n].map(Number));
                        });
                
                        // Second triangle: v1, v3, v4
                        [v1, v3, v4].forEach(([v, t, n]) => {
                            this.vertices.push(...this.cVertices[v].map(Number));
                            this.textures.push(...this.cTextures[t].map(Number));
                            this.normals.push(...this.cNormals[n].map(Number));
                        });
                    } else {
                        // It's a triangle
                        face.forEach(([v, t, n]) => {
                            this.vertices.push(...this.cVertices[v].map(Number));
                            this.textures.push(...this.cTextures[t].map(Number));
                            this.normals.push(...this.cNormals[n].map(Number));
                        });
                    }

                    this.faces.push(...face);
                    break;
            }
        }
        this.verticesBuffer = new Float32Array(this.vertices);
        this.normalsBuffer = new Float32Array(this.normals);
        this.textureBuffer = new Float32Array(this.textures);
    }
}
