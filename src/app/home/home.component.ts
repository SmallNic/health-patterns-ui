import { Component, OnInit } from '@angular/core';
import { HealthDataService } from '../services/health-data.service';
import * as CanvasJS from '../canvasjs.min.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public datasetOptionsVisibility = {};

  public activityDatasets: object[] = [
    {
      displayName: 'Steps',
      apiName: 'steps',
      xAxis: 'date',
      yAxis: 'Steps'
    },
    {
      displayName: 'Calories Burned',
      apiName: 'calories_burned',
      xAxis: 'date',
      yAxis: 'Calories'
    },
    {
      displayName: 'Distance (miles)',
      apiName: 'distance',
      xAxis: 'date',
      yAxis: 'Miles'
    }
  ];
  public sleepDatasets: object[] = [
    {
      displayName: 'Minutes In Bed',
      apiName: 'time_in_bed',
      xAxis: 'start_time',
      yAxis: 'Minutes'
    },
    {
      displayName: 'Minutes Awake',
      apiName: 'minutes_asleep',
      xAxis: 'start_time',
      yAxis: 'Minutes'
    },
    {
      displayName: 'Minutes in REM',
      apiName: 'minutes_rem',
      xAxis: 'start_time',
      yAxis: 'Minutes'
    },
    {
      displayName: 'Minutes in Light Sleep',
      apiName: 'minutes_light',
      xAxis: 'start_time',
      yAxis: 'Minutes'
    },
    {
      displayName: 'Minutes in Deep Sleep',
      apiName: 'minutes_deep',
      xAxis: 'start_time',
      yAxis: 'Minutes'
    },
  ];
  public dietDatasets: object[] = [
    {
      displayName: 'Calories In',
      apiName: 'calories_in',
      xAxis: 'date',
      yAxis: 'Calories'
    }
  ];
  public mindfulnessDatasets: object[] = [
    {
      displayName: 'Mindfulness Minutes',
      apiName: 'mindfulness_minutes',
      xAxis: 'date',
      yAxis: 'Minutes'
    }
  ];

  public months = ['January', 'February', 'March', 'April', 'May', 'June'];

  public chosenDatasets: any[] = [];
  public chosenTimeframe: any;

  public fetchedActivityData: any[];
  public fetchedSleepData: any[];
  public fetchedDietData: any[];
  public fetchedMindfulnessData: any[];

  public activityDataPoints: object[] = [];
  public sleepDataPoints: object[] = [];

  public chart: any;
  public chartTitles: string[] = [];

  constructor(private healthDataService: HealthDataService) { }

  ngOnInit(): void {
    this.renderInitialChart();
  }

  public toggleDatasetOptions = (dataset: string): void => {
    this.datasetOptionsVisibility[dataset] = !this.datasetOptionsVisibility[dataset];
  }

  public selectDataset = (dataType: string, dataset: any): void => {
    let added = false;
    this.chosenDatasets.forEach(chosen => {
      if (chosen.dataType === dataType) {
        chosen.dataset = dataset;
        added = true;
      }
    });
    if (!added) {
      this.chosenDatasets.push({ dataType, dataset });
    }
  }

  public selectTimeframe = (year: string, month: string): void => {
    this.chosenTimeframe = { year, month };
  }

  public fetchAndPlotData = (): void => {
    this.chosenDatasets.forEach(chosenDataset => {
      if (chosenDataset.dataType === 'activity') {
        this.healthDataService.getActivityData(this.chosenTimeframe.month)
          .subscribe(results => {
            this.fetchedActivityData = results.sort((a, b) => {
              return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
            });
            this.renderActivityData(chosenDataset.dataset);
          });
      }
      else if (chosenDataset.dataType === 'sleep') {
        this.healthDataService.getSleepData(this.chosenTimeframe.month)
          .subscribe(results => {
            this.fetchedSleepData = results.sort((a, b) => {
              return a.start_time < b.start_time ? -1 : a.start_time > b.start_time ? 1 : 0;
            });
            this.renderSleepData(chosenDataset.dataset);
          });
      }
    });
  }


  //////////////////////////////////// CanvasJS Functions ////////////////////////////////////

  private renderInitialChart = (): void => {
    this.chart = new CanvasJS.Chart('chartContainer', {
      backgroundColor: '#e9ecef',
      animationEnabled: true,
      showInLegend: true,
      legend: {
        cursor: 'pointer'
      },
      title: {
        text: 'Health Data'
      },
      axisY: {
        includeZero: true,
        lineThickness: 0
      },
      data: [{
        type: 'column',
        dataPoints: [{ y: 0 }]
      }]
    });
    this.chart.render();
  }

  private renderActivityData = (dataset: any): void => {
    this.activityDataPoints = this.fetchedActivityData.map(activity => {
      return {
        y: activity[dataset.apiName],
        label: this.convertDate(activity[dataset.xAxis])
      };
    });

    this.chart.options.data[0] = {
      type: 'column',
      name: 'Activity',
      showInLegend: true,
      dataPoints: this.activityDataPoints,
      yValueFormatString: '#,##0'
    };

    this.chart.options.axisY = this.formatYAxis(dataset.yAxis);
    this.chartTitles[0] = dataset.displayName;
    this.chart.options.title.text = this.getChartTitle();
    this.chart.render();
  }

  private renderSleepData = (dataset: any): void => {
    this.sleepDataPoints = [];
    this.fetchedSleepData.forEach(sleep => {
      // Skipping naps
      if (sleep.minutes_asleep > 90) {
        this.sleepDataPoints.push({
          y: sleep[dataset.apiName],
          label: this.convertDate(sleep[dataset.xAxis])
        });
      }
    });

    this.chart.options.data[1] = {
      type: 'line',
      name: 'Sleep',
      showInLegend: true,
      axisYType: 'secondary',
      yValueFormatString: '#,##0',
      dataPoints: this.sleepDataPoints
    };

    this.chart.options.axisY2 = this.formatYAxis(dataset.yAxis);
    this.chartTitles[1] = dataset.displayName;
    this.chart.options.title.text = this.getChartTitle();
    this.chart.render();
  }

  private formatYAxis = (title: string): object => {
    return {
      title,
      includeZero: false,
      lineThickness: 0
    };
  }

  private getChartTitle = (): string => {
    if (this.chartTitles.length === 1) {
      return this.chartTitles[0];
    } else if (this.chartTitles.length > 1 && this.chartTitles[0]) {
      return this.chartTitles[0] + ' vs ' + this.chartTitles[1];
    } else {
      return this.chartTitles[1];
    }
  }

  //////////////////////////////////// Utility Functions ////////////////////////////////////

  private convertDate = (date): string => {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

}