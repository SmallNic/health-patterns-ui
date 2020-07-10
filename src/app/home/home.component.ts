import { Component, OnInit } from '@angular/core';
import { HealthDataService } from '../services/health-data.service';
import * as CanvasJS from '../canvasjs.min.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public fetchedActivityData: any[];
  public activityDatasets: any[] = [
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
  public activityDataPoints: any[] = [];

  public fetchedSleepData: any[];
  public sleepDatasets: any[] = [
    {
      displayName: 'Minutes Asleep',
      apiName: 'minutes_asleep',
      xAxis: 'start_time',
      yAxis: 'Minutes'
    }
  ];
  public sleepDataPoints: any[] = [];
  public showSleepDatasets = false;

  public chart: any;
  public chartTitles = [];

  constructor(private healthDataService: HealthDataService) {
  }

  ngOnInit(): void {
    this.fetchActivityData();
    this.renderInitialChart();
  }

  private fetchActivityData = () => {
    this.healthDataService.getActivityData()
      .subscribe(results => {
        this.fetchedActivityData = results.sort((a, b) => {
          return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        });
      }
    );
  }

  private fetchSleepData = () => {
    this.healthDataService.getSleepData()
      .subscribe(results => {
        this.fetchedSleepData = results.sort((a, b) => {
          return a.start_time < b.start_time ? -1 : a.start_time > b.start_time ? 1 : 0;
        });
      }
    );
  }

  private renderInitialChart = () => {
    this.chart = new CanvasJS.Chart('chartContainer', {
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
        dataPoints: [{y: 0}]
      }]
    });
    this.chart.render();
  }

  public selectDataset = (dataType: string, dataset: any) => {
    dataType === 'activity' ? this.renderActivityData(dataset) : this.renderSleepData(dataset);
  }

  private renderActivityData = (dataset: any) => {
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

  private renderSleepData = (dataset: any) => {
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

  public showSleepRadioButtons = () => {
    if (!this.fetchedSleepData) {
      this.fetchSleepData();
      this.showSleepDatasets = true;

    }
  }

  //////////////////////////////////// CanvasJS Formatting Functions ////////////////////////////////////

  private formatYAxis = (title: string) => {
    return {
      title,
      includeZero: false,
      lineThickness: 0
    };
  }

  private getChartTitle = () => {
    if (this.chartTitles.length === 1) {
      return this.chartTitles[0];
    } else if (this.chartTitles.length > 1 && this.chartTitles[0]) {
      return this.chartTitles[0] + ' vs ' + this.chartTitles[1];
    } else {
      return this.chartTitles[1];
    }
  }

  //////////////////////////////////// Utility Functions ////////////////////////////////////

  private convertDate = (date) => {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

}