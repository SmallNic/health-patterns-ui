import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../canvasjs.min.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const dataPoints = [
      { y: 71 },
      { y: 55 },
      { y: 50 },
      { y: 65 },
      { y: 95 },
      { y: 68 },
      { y: 28 },
      { y: 34 },
      { y: 14 }
    ];

    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      title: {
        text: 'Basic Column Chart'
      },
      data: [{
        type: 'column',
        dataPoints
      }]
    });

    chart.render();
  }

}
