import { M4 } from "./math/m4";

export interface IRenderObject {
    modelMatrix: M4;
    setInitialModelMatrix(): void;

}
