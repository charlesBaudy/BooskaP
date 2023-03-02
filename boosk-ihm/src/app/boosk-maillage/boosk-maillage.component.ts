import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { Cable } from '../models/cable';
import { Ild } from '../models/ild';
import { CablesService } from '../services/cables.service';
import { IldsService } from '../services/ilds.service';
import { take } from 'rxjs/Operators';


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

  constructor(private cableService : CablesService, private ildsService : IldsService){}

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
          if(!a){
            this.ilds.push(ild);
          }
        })
      })
      console.log(this.ilds);
      drawCables(this.cables, this.canvas);
      drawIlds(this.ilds, this.canvas);
    });

    
    function drawCables(cables : Cable[],  canvas : Canvas){
      cables.forEach((cable) =>{
        let x1 = cable.relations[0].x+18;
        let y1 = cable.relations[0].y+18;
        let x2 = cable.relations[1].x+18;
        let y2 = cable.relations[1].y+18; 
        let line = new fabric.Line([x1, y1, x2, y2], { stroke: 'black', strokeWidth: 2 }); 
        canvas.add(line);
      })
    }

    function drawIlds(ilds : Ild[], canvas : Canvas):void{
      ilds.forEach((ild) => {
        const circle = new fabric.Circle({
          left: ild.x,
          top: ild.y,
          radius: 18,
          fill: setState(ild),
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

    function setState(ild : Ild): string {
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
  }
}