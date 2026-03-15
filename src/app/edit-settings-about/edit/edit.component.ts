import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EditService } from './edit.service';
import { Countdown, Show } from '../../app.model';
import { SettingsService } from '../settings/settings.service';
import { Theme } from '../settings/settings.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-edit',
  imports: [FormsModule, DatePipe],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent
{
  constructor(protected editService: EditService, private settingsService: SettingsService, private appService: AppService){ }

  themeIsLight = computed(() => {
    return this.settingsService.settings().theme == Theme.Light;
  });

  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  toDate(dateAsString: string)
  {
    return new Date(dateAsString);
  }

  addMilestone()
  {
    this.editService.addMilestone();
  }

  deleteMilestone(index: number)
  {
    this.editService.deleteMilestone(index);
  }

  showDeleteButtons = computed(() => {
    return this.appService.show().deleteMilestoneButtons;
  });

  toggleDeleteButtons()
  {
    var newShow: Show = {...this.appService.show()};
    
    newShow.deleteMilestoneButtons = !(newShow.deleteMilestoneButtons);
    
    this.appService.show.set(newShow);
  }

  showExport = computed(() => {
    return this.appService.show().exportCountdownDialog;
  });

  exportCountdown(isShow = true)
  {
    this.editService.exportCountdown(isShow);
  }

  exportCountdownText = computed(() => {
    return JSON.stringify(this.appService.current());
  });


  validationErrorsString = computed(() => {
    return this.editService.validationErrorsString();
  });

  showErrorDialog = computed(() => {
    return this.appService.show().validationErrorsDialogEdit;
  });

  closeErrorDialog()
  {
    this.editService.openErrorDialog(false);
  }

  copyExportCountdownText()
  {
    this.editService.copyExportCountdownText();
  }

  updateName(name: string)
  {
    this.editService.updateName(name);
  }

  updateEndMessage(message: string)
  {
    this.editService.updateEndMessage(message);
  }

  updateStartDate(date: string)
  {
    this.editService.updateStartDate(this.toDate(date));
  }

  updateEndDate(date: string)
  {
    this.editService.updateEndDate(this.toDate(date));
  }

  updateMilestoneName(name: string, index: number)
  {
    this.editService.updateMilestoneName(name, index);
  }

  updateMilestoneDate(date: string, index: number)
  {
    this.editService.updateMilestoneDate(this.toDate(date), index);
  }

  updateMilestoneNotes(notes: string, index: number)
  {
    this.editService.updateMilestoneNotes(notes, index);
  }
}
