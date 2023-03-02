import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ild } from "./ild";

@Entity()
export class Cable {
    @PrimaryGeneratedColumn()
    public id!: number;
    @ManyToMany(()=> Ild)
    @JoinTable()
    public relations: Ild[];
    @Column()
    public ok: boolean;
    @Column()
    public length: number;
    
    constructor(ok: boolean, relations: Ild[],length: number) {
        this.ok = ok;
        this.relations = relations;
        this.length = length
    }
}