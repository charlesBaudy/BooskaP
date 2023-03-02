export class Ild {
    public id!: number;

    public ok: boolean;

    public x: number;

    public y: number;

    public isSource: boolean;

    constructor(ok: boolean, x: number, y: number, isSource: boolean) {
        this.ok = ok;
        this.x = x;
        this.y= y;
        this.isSource = isSource;
    }
}