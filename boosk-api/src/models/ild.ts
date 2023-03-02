import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cable } from "./cable";

@Entity()
export class Ild {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public ok: boolean;
    @Column()
    public x: number;
    @Column()
    public y: number;
    @Column()
    public isSource: boolean;

    constructor(ok: boolean, x: number, y: number, isSource: boolean) {
        this.ok = ok;
        this.x = x;
        this.y= y;
        this.isSource = isSource;
    }
}