import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { Cable } from '../models/cable';
import { Ild } from '../models/ild';
import { CablesService } from '../services/cables.service';
import { IldsService } from '../services/ilds.service';
import { take } from 'rxjs/Operators';
import { SocketService } from '../services/socket.service';


@Component({
  selector: 'app-boosk-maillage',
  templateUrl: './boosk-maillage.component.html',
  styleUrls: ['./boosk-maillage.component.scss']
})
export class BooskMaillageComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true }) canvasContainerRef!: ElementRef<HTMLDivElement>;

  canvas = new fabric.Canvas('canvas');

  cables! : Cable[];
  ilds! : Ild[];

  selectedObject: fabric.Object | undefined;

  posteSource!: Ild;

  constructor(
    private cableService : CablesService,
    private ildsService : IldsService,
    private socketService: SocketService
  ) {
      this.socketService.listenToServer('Change').subscribe(change=>{
        this.ilds.forEach(ild=>{
          if(ild.id === change.id) {
            ild.ok = false;
          } else {
            ild.ok = true;
          }
        });
        this.dijkstra(this.cables, this.ilds, this.posteSource, change);
        this.drawIlds(this.ilds,this.canvas);
      })
  }

  ngOnInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);

    this.cableService.getAllCables()
    .pipe(take(1))
    .subscribe(cables => {
      this.cables = cables
      console.log(this.cables);
      this.ilds = [];
      cables.forEach(cable => {
        cable.relations.forEach(ild => {
          let a = this.ilds.find(x => x.id === ild.id)
          if(!this.posteSource && ild.id ===9){
            this.posteSource = ild;
          }
          if(!a){
            this.ilds.push(ild);
          }
        })
      })
      console.log(this.ilds);
      this.drawCables(this.cables, this.canvas);
      this.drawIlds(this.ilds, this.canvas);
      let posteSource = this.ilds.find(x => x.id === 9);


      this.canvas.on('mouse:down', (event) => {
        if (event.target) {
            let pts = event.pointer;
            let selectedIld: Ild | undefined = undefined;

            this.ilds.forEach((ild) => {
                if (pts &&pts.x > ild.x &&pts.x < ild.x + 36 &&pts.y > ild.y &&pts.y < ild.y + 36) {
                    let destination = ild;
                    let clickedIld = ild;

                    if (!ild.isSource) {
                        let newOkValue: boolean;

                        if (ild.ok) {
                            newOkValue = false;
                        } else {
                            newOkValue = true;
                        }

                        this.ilds.forEach(otherIld => {
                            if (otherIld.id === clickedIld.id) {
                                otherIld.ok = newOkValue;
                            } else {
                                otherIld.ok = true;
                            }

                            this.ildsService.setIldOk(otherIld.id, otherIld.ok).subscribe();
                        });

                        this.ildsService.setIldOk(clickedIld.id, clickedIld.ok).subscribe((res) => {
                            if (posteSource && res.status === 200) {
                                selectedIld = clickedIld;
                                if(!selectedIld.ok){
                                  this.dijkstra(this.cables, this.ilds, posteSource, destination);
                                }
                                else{
                                  this.deleteLigne();
                                  this.drawCables(this.cables, this.canvas);
                                }

                                this.drawIlds(this.ilds, this.canvas);
                            }
                        });
                    }
                }
            });
        }
    });




    });
  }

  deleteLigne(){
    this.canvas.getObjects('line').forEach((obj) => {
      if (obj.stroke === 'black' || obj.stroke === 'yellow') {
        this.canvas.remove(obj);
      }
    });

    this.canvas.getObjects('text').forEach((obj) =>{
      if (obj.fill === "#FFFEFE"){
        this.canvas.remove(obj);
      }
    })
  }


  dijkstra(cables : Cable[], ilds : Ild[], sourceIld: Ild, destinationIld: Ild): Ild[] {
    // Initialisation
    const Q = [...ilds]; // liste des ILD restants à traiter
    const dist = new Map<number, number>(); // distances les plus courtes connues
    const prev = new Map<number, Ild | undefined>(); // précédents dans le chemin le plus court connu
    for (const ild of Q) {
      dist.set(ild.id, Infinity);
      prev.set(ild.id, undefined);
    }
    dist.set(sourceIld.id, 0);

    // Boucle principale
    while (Q.length > 0) {
      // Trouver l'ILD non visité avec la distance minimale
      let u = Q[0];
      for (const v of Q) {
        if (dist.get(v.id)! < dist.get(u.id)!) {
          u = v;
        }
      }
      // Si on a atteint la destination, terminer
      if (u.id === destinationIld.id) {
        break;
      }
      // Marquer l'ILD comme visité
      Q.splice(Q.indexOf(u), 1);
      // Mettre à jour les distances des ILD adjacents
      for (const cable of cables.filter(c => c.relations.some(r => r.id === u.id))) {
        const v = cable.relations.find(r => r.id !== u.id)!;
        const alt = dist.get(u.id)! + cable.length;
        if (alt < dist.get(v.id)!) {
          dist.set(v.id, alt);
          prev.set(v.id, u);
        }
      }
    }

    // Construire le chemin le plus court
    const path: Ild[] = [];
    let u = destinationIld;
    while (prev.get(u.id) !== undefined) {
      path.unshift(u);
      u = prev.get(u.id)!;
    }
    path.unshift(u);
    console.log(path);

    let cableSurChemin : Cable[]  = [];
    for (let i = 0; i < path.length - 1; i++) {
      const currentIld = path[i];
      const nextIld = path[i + 1];
      const cable = cables.find(c => {
        const r1 = c.relations.find(r => r.id === currentIld.id);
        const r2 = c.relations.find(r => r.id === nextIld.id);
        return r1 && r2;
      });
      //console.log(`Câble entre ${currentIld.id} et ${nextIld.id}: ${cable?.id}`);
      if(cable){
        cableSurChemin.push(cable);
      }
      console.log(cableSurChemin);
    }


    this.deleteLigne();
    this.drawCables(cables, this.canvas);
    this.drawCables(cableSurChemin, this.canvas, cableSurChemin);

    return path;
  }

  drawIlds(ilds : Ild[], canvas : Canvas):void{
    ilds.forEach((ild) => {
      const circle = new fabric.Circle({
        left: ild.x,
        top: ild.y,
        radius: 18,
        fill: this.setState(ild),
        stroke: 'black',
        strokeWidth: 2,
        selectable: false,
      });

      const text = new fabric.Text(String(ild.id), {
        left: ild.x,
        top: ild.y,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: 'white',
        selectable: false,
        textAlign : 'center',
      });

      // Centrer le texte dans le cercle
      const textLeft = ild.x + 12.5;
      const textTop = ild.y + 7.5;

      text.set({
        left: textLeft,
        top: textTop
      });

      canvas.add(circle, text);
    });


  }

  setState(ild : Ild): string {
    if (ild.ok && !ild.isSource){
      return 'green';
    }
    else if (ild.isSource){
      return 'blue';
    }
    else{
      return 'red';
    }
  }


  drawCables(cables : Cable[],  canvas : Canvas, chemin? : Cable[]){
    cables.forEach((cable) =>{
      let color : string;
      let x1 = cable.relations[0].x+18;
      let y1 = cable.relations[0].y+18;
      let x2 = cable.relations[1].x+18;
      let y2 = cable.relations[1].y+18;
      if (chemin && chemin?.indexOf(cable) !== -1){
        color = "yellow"
      } else {
        color = "black"
      }

      let line = new fabric.Line([x1, y1, x2, y2], { stroke: color, strokeWidth: 2, selectable : false});
      let label = new fabric.Text(cable.length.toString(), {
        left: ((x1 + x2) / 2)-4,
        top: ((y1 + y2) / 2) -7,
        fontSize: 14,
        fill: '#FFFEFE',
        selectable : false,
        fontWeight : 'bold'
      })
      canvas.add(line);
      if(!chemin){
        canvas.add(label);
      }
    })
  }
}
