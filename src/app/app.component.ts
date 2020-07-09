import { Component } from '@angular/core';
import { HealthDataService } from './services/health-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HealthDataService]
})
export class AppComponent {
  title = 'My Health Patterns';
}
