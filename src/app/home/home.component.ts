import { Component, OnInit } from '@angular/core';
import { HealthDataService } from '../services/health-data.service';
import * as CanvasJS from '../canvasjs.min.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public activityData: any[];
  public sleepData: any[];

  public datasets: any[] = [
    {
      displayName: 'Calories Burned',
      apiName: 'calories_burned',
      labelName: 'date'
    },
    {
      displayName: 'Steps',
      apiName: 'steps',
      labelName: 'date'
    },
    {
      displayName: 'Distance (miles)',
      apiName: 'distance',
      labelName: 'date'
    }
  ];

  public chosenDataset: any;


  public chart: any;
  public chartTitle = 'My Health Data';
  public dataPoints: any[] = [
    { y: 0 }
  ];

  constructor(
    private healthDataService: HealthDataService
  ) {

    this.healthDataService.getActivityData()
      .subscribe(
        results => {
          console.log('results', results);
          this.activityData = results;
        });

  }

  ngOnInit(): void {
    this.chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      title: {
        text: this.chartTitle
      },
      data: [{
        type: 'column',
        dataPoints: this.dataPoints
      }]
    });
    this.chart.render();
  }

  public selectDataset = (dataset) => {
    this.chosenDataset = dataset;
    this.dataPoints = this.activityData.map(activity => {
      return {
        y: activity[dataset.apiName],
        label: this.convertDate(activity.date)
      };
    });
    this.chart.options.data[0].dataPoints = this.dataPoints;
    this.chart.options.title.text = `${this.chartTitle} -  ${dataset.displayName}`;
    this.chart.render();
  }

  private convertDate = (date) => {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

}
