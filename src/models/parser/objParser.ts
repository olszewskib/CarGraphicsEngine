export class OBJParser {
    cVertices: string[][] = [];
    cTextures: string[][] = [];
    cNormals: string[][] = [];
    faces: number[][] = [];
    vertices: number[] = [];
    textures: number[] = [];
    normals: number[] = [];

    parse(objContent: string) {
        const lines = objContent.split("\n");

        for (let line of lines) {
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
                    face.forEach(([v, t, n]) => {
                        this.vertices.push(...this.cVertices[v].map(Number));
                        this.textures.push(...this.cTextures[t].map(Number));
                        this.normals.push(...this.cNormals[n].map(Number));
                    });

                    this.faces.push(...face);
                    break;
            }
        }
    }
}
