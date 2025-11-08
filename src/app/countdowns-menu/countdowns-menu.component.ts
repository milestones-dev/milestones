import { Component, computed, Signal, signal } from '@angular/core';
import { AppService } from '../app.service';
import { CountdownsMenuService } from './countdowns-menu.service';
import { Countdown, Show } from '../app.model';
import { SettingsService } from '../edit-settings-about/settings/settings.service';
import { Theme } from '../edit-settings-about/settings/settings.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-countdowns-menu',
  imports: [FormsModule],
  templateUrl: './countdowns-menu.component.html',
  styleUrl: './countdowns-menu.component.css'
})
export class CountdownsMenuComponent {
  constructor(protected countdownsMenuService: CountdownsMenuService, private appService: AppService, private settingsService: SettingsService)
  {}

  // This is set to the index of the countdown the user clicks delete on and is used when the user clicks delete in the confirm dialog to identify the countdown outside the for loop
  countdownToDelete = signal<number>(-1);
  importedCountdownText = signal<string>("");
  errorText = signal<string>("");

  countdownCountWithinLimit = computed(() => {
    return this.countdownsMenuService.countdownCountWithinLimit();
  });

  oneCountdownLeft = computed(() => {
    return this.appService.countdowns().length == 1;
  });

  selectedCountdown = computed(() => {
    return this.appService.selected().countdown;
  });

  showDeleteButtons = computed(() => {
    return this.appService.show().countdownsMenuDeleteButtons;
  });

  toggleDeleteButtons()
  {
    let newShow: Show = {...this.appService.show()};
    
    newShow.countdownsMenuAddOptions = false;
    newShow.countdownsMenuDeleteButtons = !(newShow.countdownsMenuDeleteButtons);
        
    this.appService.show.set(newShow);
  }

  openDeleteDialog(isOpen = true, countdownToDelete = -1)
  {
    let newShow: Show = {...this.appService.show()};
        
    newShow.countdownsMenuDeleteConfirm = isOpen;
        
    this.appService.show.set(newShow);

    this.countdownToDelete.set(countdownToDelete);

    console.log("countdownToDelete = " + this.countdownToDelete());
  }

  deleteCountdown(index: number)
  {
    this.countdownsMenuService.deleteCountdown(index);
    this.countdownToDelete.set(-1);
  }

  getCountdownName(index: number)
  {
    if(index < 0)
    {
      return computed(() => { return ""; });
    }

    return computed(() => {
      return this.appService.countdowns()[index].name.length == 0 ? ("countdown " + (index+1)) : this.appService.countdowns()[index].name;
    });
  }

  openCountdownsMenu(isOpen = true)
  {
    let newShow: Show = {...this.appService.show()};
        
    newShow.countdownsMenu = isOpen;
    if(!isOpen)
    {
      newShow.countdownsMenuAddOptions = false;
      newShow.countdownsMenuDeleteButtons = false;
      newShow.countdownsMenuDeleteConfirm = false;
    }
        
    this.appService.show.set(newShow);
  }

  showCountdownsMenu = computed(() => {
    return this.appService.show().countdownsMenu;
  });

  themeIsLight = computed(() => {
      return this.settingsService.settings().theme == Theme.Light;
    });
  
  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  toggleAddOptions()
  {
    let newShow: Show = {...this.appService.show()};
    
    newShow.countdownsMenuDeleteButtons = false;
    newShow.countdownsMenuAddOptions = !(newShow.countdownsMenuAddOptions);
        
    this.appService.show.set(newShow);
  }

  showAddOptions = computed(() => {
    return this.appService.show().countdownsMenuAddOptions;
  });

  getBarLength(index: number)
  {
    return this.countdownsMenuService.getBarLength(index);
  }

  switchCountdown(index: number)
  {
    this.countdownsMenuService.switchCountdown(index);
  }

  addCountdown(isYearToTear = false)
  {
    this.countdownsMenuService.addCountdown(isYearToTear);
  }

  showDeleteConfirm = computed(() => {
    return this.appService.show().countdownsMenuDeleteConfirm;
  })

  showImportCountdown = computed(() => {
    return this.appService.show().countdownsMenuImportDialog;
  });

  openImportCountdown(isOpen = true)
  {
    let newShow: Show = {...this.appService.show()};
        
    newShow.countdownsMenuImportDialog = isOpen;
    newShow.countdownsMenuAddOptions = false;
    this.errorText.set("");
        
    this.appService.show.set(newShow);
  }

  importCountdown()
  {
    var importSuccess = this.countdownsMenuService.importCountdown(this.importedCountdownText());

    if(importSuccess)
    {
      this.openImportCountdown(false);
    }
    else
    {
      this.errorText.set("The input does not contain valid JSON data. Copy the entire countdown JSON text from the export window text field and try again.");
    }
  }
}
