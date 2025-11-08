import { Component, computed } from '@angular/core';
import { AppService } from '../app.service';
import { SettingsService } from '../edit-settings-about/settings/settings.service';
import { Theme } from '../edit-settings-about/settings/settings.model';
import { Show } from '../app.model';
import { MilestonesListComponent } from './milestones-list/milestones-list.component';
import { MilestoneNotesComponent } from './milestone-notes/milestone-notes.component';

@Component({
  selector: 'app-milestones-list-notes',
  imports: [MilestonesListComponent, MilestoneNotesComponent],
  templateUrl: './milestones-list-notes.component.html',
  styleUrl: './milestones-list-notes.component.css'
})
export class MilestonesListNotesComponent
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

  showNotes = computed(() => {
    return this.appService.show().milestonesNotes;
  });

  openList()
  {
    var newShow: Show = {...this.appService.show()};
    
    newShow.milestonesList = true;
    newShow.milestonesNotes = false;
    
    this.appService.show.set(newShow);
  }

  openNotes()
  {
    var newShow: Show = {...this.appService.show()};
    
    newShow.milestonesList = false;
    newShow.milestonesNotes = true;
    
    this.appService.show.set(newShow);
  }
}
