import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AppService } from '../app.service';
import { Show } from '../app.model';
import { SettingsComponent } from "./settings/settings.component";
import { SettingsService } from './settings/settings.service';
import { Theme } from './settings/settings.model';
import { EditComponent } from "./edit/edit.component";
import { EditService } from './edit/edit.service';

@Component({
  selector: 'app-edit-settings-about',
  imports: [SettingsComponent, EditComponent],
  templateUrl: './edit-settings-about.component.html',
  styleUrl: './edit-settings-about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSettingsAboutComponent {
  constructor(private appService: AppService, private settingsService: SettingsService, private editService: EditService){}

  showWindow = computed(() => {
    return this.appService.show().editSettingsAboutContainer;
  });

  showEdit = computed(() => {
    return this.appService.show().edit;
  });

  showSettings = computed(() => {
    return this.appService.show().settings;
  });

  showAbout = computed(() => {
    return this.appService.show().about;
  });

  showSidebarMobile = computed(() => {
    return this.appService.show().sidebarMobile;
  });

  themeIsLight = computed(() => {
    return this.settingsService.settings().theme == Theme.Light;
  });

  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  openEdit()
  {
    let newShow: Show = {...this.appService.show()};

    newShow.editSettingsAboutContainer = true;
    newShow.edit = true;
    newShow.settings = false;
    newShow.about = false;
    newShow.sidebarMobile = false;

    this.appService.show.set(newShow);
  }

  openSettings()
  {
    let newShow: Show = {...this.appService.show()};

    newShow.editSettingsAboutContainer = true;
    newShow.edit = false;
    newShow.settings = true;
    newShow.about = false;
    newShow.sidebarMobile = false;
    newShow.deleteMilestoneButtons = false;

    this.appService.show.set(newShow);
  }

  openAbout()
  {
    let newShow: Show = {...this.appService.show()};

    newShow.editSettingsAboutContainer = true;
    newShow.edit = false;
    newShow.settings = false;
    newShow.about = true;
    newShow.sidebarMobile = false;
    newShow.deleteMilestoneButtons = false;

    this.appService.show.set(newShow);
  }

  toggleSidebarMobile()
  {
    var newShow: Show = {...this.appService.show()};

    newShow.sidebarMobile = !(newShow.sidebarMobile);

    this.appService.show.set(newShow);
  }

  getHeader = computed(() => 
    {
      if(this.showEdit())
      {
        return "Edit Countdown";
      }
      else if(this.showSettings())
      {
        return "Settings";
      }
      else if(this.showAbout())
      {
        return "About";
      }
  
      return "Edit Countdown";
    }
  );

  saveAndClose()
  {
    this.settingsService.saveSettings();
    let countdownValid = this.editService.validateAndSaveCountdown();

    if(countdownValid)
    {
      var newShow: Show = {...this.appService.show()};

      newShow.editSettingsAboutContainer = false;
      newShow.deleteMilestoneButtons = false;
      newShow.setTimeRemaining = false;
      newShow.language = false;
      newShow.notificationSetting = false;
      newShow.setMilestoneLabelFormat = false;
  
      this.appService.show.set(newShow);
    }
    else
    {
      this.openEdit();
    }
  }

  exportCountdown()
  {
    this.editService.exportCountdown();
  }

  countdownCount = computed(() => {
    return this.appService.countdowns().length;
  });
  
}
