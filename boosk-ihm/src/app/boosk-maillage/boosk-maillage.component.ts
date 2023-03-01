import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-boosk-maillage',
  templateUrl: './boosk-maillage.component.html',
  styleUrls: ['./boosk-maillage.component.scss'] 
})
export class BooskMaillageComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true }) canvasContainerRef!: ElementRef<HTMLDivElement>;

  canvas = new fabric.Canvas('canvas');

  ngOnInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement);

    // Dessin du maillage électrique
    const line2 = new fabric.Line([100, 50, 150, 100], { stroke: 'black', strokeWidth: 2 });
    const line3 = new fabric.Line([150, 100, 200, 100], { stroke: 'black', strokeWidth: 2 });
    const line4 = new fabric.Line([200, 100, 250, 150], { stroke: 'black', strokeWidth: 2 });
    const line5 = new fabric.Line([250, 150, 300, 150], { stroke: 'black', strokeWidth: 2 });
    const line6 = new fabric.Line([300, 150, 350, 200], { stroke: 'black', strokeWidth: 2 });
    const line7 = new fabric.Line([350, 200, 400, 200], { stroke: 'black', strokeWidth: 2 });

    //this.canvas.add(line1, line2, line3, line4, line5, line6, line7);

    // Dessin des marqueurs
    const ildPositions = [
      //Numéro 1
      [208, 110],
      //Numéro 2
      [400, 110],
      //Numéro 3
      [592, 110],
      //Numéro 4
      [730, 270],
      //Numéro 5
      [592, 430],
      //Numéro 6
      [400, 430],
      //Numéro 7
      [208, 430],
      //Numéro 8
      [400, 270],
      //Numéro 9
      [70, 270],
      
    ];

    function randomBoolean(): boolean {
      return Math.random() < 0.8;
    }

    function setState(): string {
      if (randomBoolean()){
        return 'green';
      }
      else{
        return 'red';
      }
    }

    ildPositions.forEach((position, index) => {
      const circle = new fabric.Circle({
        left: position[0],
        top: position[1],
        radius: 18,
        fill: setState(),
        stroke: 'black',
        strokeWidth: 2,
        selectable: false,
      });

      const text = new fabric.Text(String(index+1), {
        left: position[0],
        top: position[1],
        fontSize: 20,
        fontFamily: 'Arial',
        fill: 'white',
        selectable: false,
        textAlign : 'center',
      });

      // Centrer le texte dans le cercle
      const textLeft = position[0] + 12.5;
      const textTop = position[1] + 7.5;

      text.set({
        left: textLeft,
        top: textTop
      });

      this.canvas.add(circle, text);
    });
  }
}