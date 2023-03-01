import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ild } from "./ild";

@Entity()
export class Cable {
    @PrimaryGeneratedColumn()
    public id: number;
    @OneToOne(()=> Ild)
    @JoinColumn()
    public from: Ild;
    @OneToOne(()=> Ild)
    @JoinColumn()
    public to: Ild;
    @Column()
    public ok: boolean;
    
    constructor(id: number, ok: boolean, from: Ild, to: Ild) {
        this.id = id;
        this.ok = ok;
        this.from = from;
        this.to= to;
    }
}