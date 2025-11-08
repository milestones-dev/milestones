import { Component, computed } from '@angular/core';
import { AppService } from '../../app.service';
import { MilestonesListService } from './milestones-list.service';
import { SettingsService } from '../../edit-settings-about/settings/settings.service';
import { Theme } from '../../edit-settings-about/settings/settings.model';

@Component({
  selector: 'app-milestones-list',
  imports: [],
  templateUrl: './milestones-list.component.html',
  styleUrl: './milestones-list.component.css'
})
export class MilestonesListComponent
{
  constructor(private appService: AppService, private milestonesListService: MilestonesListService, private settingsService: SettingsService) {}

  milestones = computed(() => {
    return this.appService.current().milestones;
  });

  getMilestoneBar(index: number)
  {
    return this.milestonesListService.getMilestoneBar(index);
  }

  getMilestoneDaysRemaining(index: number)
  {
    return this.milestonesListService.getMilestoneDaysRemaining(index);
  }

  themeIsLight = computed(() => {
        return this.settingsService.settings().theme == Theme.Light;
  });
    
  themeIsDark = computed(() => {
        return this.settingsService.settings().theme == Theme.Dark;
  });

}
