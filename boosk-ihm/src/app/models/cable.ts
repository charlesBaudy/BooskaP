import { Ild } from "./ild";

export class Cable {
    public id!: number;
    
    public relations: Ild[];
    
    public ok: boolean;
    
    public length: number;
    
    constructor(ok: boolean, relations: Ild[],length: number) {
        this.ok = ok;
        this.relations = relations;
        this.length = length
    }
}