import { AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { io } from "..";

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

    @AfterUpdate()
    async afterUpdate() {
        if (!this.ok) {
            // La valeur de la colonne "ok" est passée de "true" à "false"
            // Émettez un événement ou exécutez le code correspondant ici
            io.sockets.emit('Change', this);
            console.log(`ild ${this.id} state is updated to ${this.ok}`);
        }
    }

    constructor(ok: boolean, x: number, y: number, isSource: boolean) {
        this.ok = ok;
        this.x = x;
        this.y= y;
        this.isSource = isSource;
    }
}