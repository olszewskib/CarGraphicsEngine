export class ColorModel {
    isFog: boolean = false;
    fogAmount: number = 0.0;
    m: number;
    ks: number;
    kd: number;
    shadingMode: number = 0;

    constructor(m: number, ks: number, kd: number) {
        this.m = m;
        this.ks = ks;
        this.kd = kd;
    }

}