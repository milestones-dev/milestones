import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AppService } from '../app.service';
import { SettingsService } from '../edit-settings-about/settings/settings.service';
import { Theme } from '../edit-settings-about/settings/settings.model';
import { Show } from '../app.model';
import { MilestonesListComponent } from './milestones-list/milestones-list.component';
import { MilestoneDetailsComponent } from './milestone-details/milestone-details.component';

@Component({
  selector: 'app-milestones-list-details',
  imports: [MilestonesListComponent, MilestoneDetailsComponent],
  templateUrl: './milestones-list-details.component.html',
  styleUrl: './milestones-list-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilestonesListDetailsComponent
{
  constructor(private appService: AppService, private settingsService: SettingsService) {}

  showWindow = computed(() => {
    return this.appService.show().milestonesInfo;
  });

  themeIsLight = computed(() => {
      return this.settingsService.settings().theme == Theme.Light;
    });
  
  themeIsDark = computed(() => {
      return this.settingsService.settings().theme == Theme.Dark;
  });

  closeMilestonesInfoWindow()
  {
    var newShow: Show = {...this.appService.show()};
    
    newShow.milestonesInfo = false;
    
    this.appService.show.set(newShow);
  }

  showList = computed(() => {
    return this.appService.show().milestonesList;
  });

  showDetails = computed(() => {
    return this.appService.show().milestoneDetails;
  });

  openList()
  {
    var newShow: Show = {...this.appService.show()};
    
    newShow.milestonesList = true;
    newShow.milestoneDetails = false;
    
    this.appService.show.set(newShow);
  }

  openDetails()
  {
    var newShow: Show = {...this.appService.show()};
    
    newShow.milestonesList = false;
    newShow.milestoneDetails = true;
    
    this.appService.show.set(newShow);
  }
}
