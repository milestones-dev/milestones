import { Component, signal } from '@angular/core';
import { Countdown } from './app.model';
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { AppService } from './app.service';
import { EditSettingsAboutComponent } from "./edit-settings-about/edit-settings-about.component";
import { StatusBarComponent } from './status-bar/status-bar.component';
import { CountdownsMenuComponent } from "./countdowns-menu/countdowns-menu.component";
import { MilestonesListNotesComponent } from './milestones-list-notes/milestones-list-notes.component';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  selector: 'app-root',
  imports: [ProgressBarComponent, StatusBarComponent, EditSettingsAboutComponent, CountdownsMenuComponent, MilestonesListNotesComponent, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Milestones';
  constructor(private appService: AppService){}
  
}
