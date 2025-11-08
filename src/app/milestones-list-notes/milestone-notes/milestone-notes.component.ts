import { Component, computed, signal } from '@angular/core';
import { AppService } from '../../app.service';
import { SettingsService } from '../../edit-settings-about/settings/settings.service';
import { Theme } from '../../edit-settings-about/settings/settings.model';
import { FormsModule } from '@angular/forms';
import { MilestoneNotesService } from './milestone-notes.service';

@Component({
  selector: 'app-milestone-notes',
  imports: [FormsModule],
  templateUrl: './milestone-notes.component.html',
  styleUrl: './milestone-notes.component.css'
})
export class MilestoneNotesComponent
{
  constructor(private appService: AppService, private settingsService: SettingsService, protected milestoneNotesService: MilestoneNotesService){}

  milestoneIsSelected = computed(() => {
    return this.appService.selected().milestone != -1;
  });

  themeIsLight = computed(() => {
    return this.settingsService.settings().theme == Theme.Light;
  });
      
  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  saveNotes()
  {
    this.milestoneNotesService.saveNotes();
  }

  validateNotes()
  {
    return this.milestoneNotesService.validateNotes();
  }

  showSaveButton = computed(() => {
    return this.milestoneNotesService.showSaveButton();
  });

  showErrorText = computed(() => {
    return this.milestoneNotesService.showErrorText();
  });
  
}
