import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AppService } from '../../app.service';
import { SettingsService } from '../../edit-settings-about/settings/settings.service';
import { Theme } from '../../edit-settings-about/settings/settings.model';
import { FormsModule } from '@angular/forms';
import { MilestoneDetailsService } from './milestone-details.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-milestone-details',
  imports: [FormsModule, DatePipe],
  templateUrl: './milestone-details.component.html',
  styleUrl: './milestone-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MilestoneDetailsComponent
{
  constructor(private appService: AppService, private settingsService: SettingsService, protected milestoneDetailsService: MilestoneDetailsService){}

  toDate(dateAsString: string)
  {
    return new Date(dateAsString);
  }

  milestoneIsSelected = computed(() => {
    return this.appService.selected().milestone != -1;
  });

  themeIsLight = computed(() => {
    return this.settingsService.settings().theme == Theme.Light;
  });
      
  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  saveDetails()
  {
    this.milestoneDetailsService.saveDetails();
  }

  validateNotes()
  {
    this.milestoneDetailsService.validateNotes();
  }

  validateName()
  {
    this.milestoneDetailsService.validateName();
  }

  validateDate()
  {
    this.milestoneDetailsService.validateDate();
  }

  showSaveButton = computed(() => {
    return this.milestoneDetailsService.showSaveButton();
  });
  
}
