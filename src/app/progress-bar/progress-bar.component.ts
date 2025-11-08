import { Component, computed } from '@angular/core';
import { ProgressBarService } from './progress-bar.service';
import { SettingsService } from '../edit-settings-about/settings/settings.service';
import { Theme } from '../edit-settings-about/settings/settings.model';
import { AppService } from '../app.service';
import { Show } from '../app.model';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  constructor(private appService: AppService, private progressBarService: ProgressBarService, private settingsService: SettingsService){}

  themeIsLight = computed(() => {
    return this.settingsService.settings().theme == Theme.Light;
  });

  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  getBarLength = computed(() => {
    return this.progressBarService.getBarLength();
  });

  getBarColour = computed(() => {
    return this.progressBarService.getBarColour();
  });

  getPercentageLabelText = computed(() => {
    return this.progressBarService.getPercentageLabelText();
  });

  getMilestones = computed(() => {
    return this.progressBarService.getMilestones();
  });

  getMilestoneOffset(index: number)
  {
      return this.progressBarService.getMilestoneOffset(index);
  }

  getTimeRemaining = computed(() => {
    return this.progressBarService.getTimeRemaining();
  });

  getMilestoneLabelText(index: number)
  {
    return this.progressBarService.getMilestoneLabelText(index);
  }

  selectMilestone(index: number)
  {
    this.progressBarService.selectMilestone(index);
  }

  isSelectedMilestone(index: number)
  {
    return this.progressBarService.isSelectedMilestone(index);
  }

  showMilestonesInfo = computed(() => {
    return this.appService.show().milestonesInfo;
  });

  toggleMilestoneInfo()
  {
    let newShow: Show = {...this.appService.show()};

    newShow.milestonesInfo = !(newShow.milestonesInfo);

    this.appService.show.set(newShow);
  }

  getOpenCloseMilestonesInfoImgSrc = computed(() => {

    if(this.showMilestonesInfo())
    {
      if(this.themeIsLight())
      {
        return "closeMilestonesInfoLight.svg";
      }
      else
      {
        return "closeMilestonesInfoDark.svg";
      }
    }
    else
    {
      if(this.themeIsLight())
      {
        return "openMilestonesInfoLight.svg";
      }
      else
      {
        return "openMilestonesInfoDark.svg";
      }
    }
  });

}
