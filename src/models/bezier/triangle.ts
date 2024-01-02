import { Vertex } from "./vertex";

export class Triangle {
    p1: Vertex;
    p2: Vertex;
    p3: Vertex;

    constructor(p1: Vertex, p2: Vertex, p3: Vertex) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}