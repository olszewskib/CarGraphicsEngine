class OBJLoader {
    parse(data: string) {
        var positions = [];
        var normals = [];
        var texcoords = [];
        var indices = [];

        // Split the file into lines
        const lines = data.split('\n');

        for (let line of lines) {
            // Split the line into parts
            const parts = line.trim().split(/\s+/);

            switch (parts[0]) {
                case 'v':
                    // Vertex position
                    positions.push(parts.slice(1).map(Number));
                    break;
                case 'vn':
                    // Vertex normal
                    normals.push(parts.slice(1).map(Number));
                    break;
                case 'vt':
                    // Texture coordinate
                    texcoords.push(parts.slice(1).map(Number));
                    break;
                case 'f':
                    // Face
                    indices.push(...parts.slice(1).map(Number));
                    break;
            }
        }

        return { positions, normals, texcoords, indices };
    }
}