import { Component, computed, signal } from '@angular/core';
import { SettingsService } from './settings.service';
import { Language, MilestoneLabelFormat, NotificationSetting, Theme, TimeRemainingText, Wallpaper, WallpaperPreview } from './settings.model';
import { AppService } from '../../app.service';
import { Show } from '../../app.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  Light = signal<Theme>(Theme.Light);
  Dark = signal<Theme>(Theme.Dark);

  Days = signal<TimeRemainingText>(TimeRemainingText.Days);
  Weeks = signal<TimeRemainingText>(TimeRemainingText.Weeks);
  Months = signal<TimeRemainingText>(TimeRemainingText.Months);
  MonthsDays = signal<TimeRemainingText>(TimeRemainingText.MonthsDays);

  Name = signal<MilestoneLabelFormat>(MilestoneLabelFormat.Name);
  Date = signal<MilestoneLabelFormat>(MilestoneLabelFormat.Date);
  Percentage = signal<MilestoneLabelFormat>(MilestoneLabelFormat.Percentage);
  DayNumber = signal<MilestoneLabelFormat>(MilestoneLabelFormat.DayNumber);

  Both = signal<NotificationSetting>(NotificationSetting.Both);
  Countdowns = signal<NotificationSetting>(NotificationSetting.Countdowns);
  Milestones = signal<NotificationSetting>(NotificationSetting.Milestones);
  Off = signal<NotificationSetting>(NotificationSetting.Off);

  English = signal<Language>(Language.English);
  French = signal<Language>(Language.French);
  German = signal<Language>(Language.German);
  Spanish = signal<Language>(Language.Spanish);
  Portuguese = signal<Language>(Language.Portuguese);
  Italian = signal<Language>(Language.Italian);
  Polish = signal<Language>(Language.Polish);
  Russian = signal<Language>(Language.Russian);

  Default = signal<Wallpaper>(Wallpaper.Default);
  BoatHouse = signal<Wallpaper>(Wallpaper.BoatHouse);
  OldBuilding = signal<Wallpaper>(Wallpaper.OldBuilding);
  LondonEye = signal<Wallpaper>(Wallpaper.LondonEye);
  Canal = signal<Wallpaper>(Wallpaper.Canal);
  SkiResort = signal<Wallpaper>(Wallpaper.SkiResort);
  Houses = signal<Wallpaper>(Wallpaper.Houses);
  Custom = signal<Wallpaper>(Wallpaper.Custom);

  BoatHousePreview = signal<WallpaperPreview>(WallpaperPreview.BoatHouse);
  OldBuildingPreview = signal<WallpaperPreview>(WallpaperPreview.OldBuilding);
  LondonEyePreview = signal<WallpaperPreview>(WallpaperPreview.LondonEye);
  CanalPreview = signal<WallpaperPreview>(WallpaperPreview.Canal);
  SkiResortPreview = signal<WallpaperPreview>(WallpaperPreview.SkiResort);
  HousesPreview = signal<WallpaperPreview>(WallpaperPreview.Houses);

  CurrentTheme = computed(() => {
    return this.settingsService.settings().theme;
  });

  customWallpaperUrl = signal<string>("");

  constructor(private appService: AppService, private settingsService: SettingsService)
  {
    this.customWallpaperUrl.set(this.settingsService.settings().customWallpaperUrl);
  }

  themeIsLight = computed(() => {
    return this.settingsService.themeIsLight();
  });

  themeIsDark = computed(() => {
    return this.settingsService.themeIsDark();
  });

  themeIsAuto = computed(() => {
    return this.settingsService.themeIsAuto();
  });

  setTheme(newSetting: Theme)
  {
    this.settingsService.setTheme(newSetting);
  }

  setAutoTheme()
  {
    this.settingsService.setAutoTheme();
  }


  // boolean returns true if time remaining options drop down is displaying
  showTimeRemainingOptions = computed(() => {
    return this.appService.show().setTimeRemaining;
  });

  // shows / hides the time remaining options drop down
  openTimeRemainingOptions()
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.setTimeRemaining = !(this.appService.show().setTimeRemaining);
    newShow.setMilestoneLabelFormat = false;
    newShow.notificationSetting = false;
    newShow.language = false;

    this.appService.show.set(newShow);
  }

  getTimeRemaining = computed(() => {
    return this.settingsService.settings().timeRemainingText;
  });

  setTimeRemaining(newSetting: TimeRemainingText)
  {
    this.settingsService.setTimeRemainingText(newSetting);

    this.openTimeRemainingOptions();
  }

  getOpenCloseTimeRemainingImg = computed(() => {
    if(this.showTimeRemainingOptions())
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "closeDropdownLight.svg";
      }
      else
      {
        return "closeDropdownDark.svg";
      }
    }
    else
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "openDropdownLight.svg";
      }
      else
      {
        return "openDropdownDark.svg";
      }
    }
  });

  getOpenCloseLabelFormatImg = computed(() => {
    if(this.showMilestoneLabelFormatOptions())
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "closeDropdownLight.svg";
      }
      else
      {
        return "closeDropdownDark.svg";
      }
    }
    else
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "openDropdownLight.svg";
      }
      else
      {
        return "openDropdownDark.svg";
      }
    }
  });

  getOpenCloseNotificationsImg = computed(() => {
    if(this.showNotificationsOptions())
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "closeDropdownLight.svg";
      }
      else
      {
        return "closeDropdownDark.svg";
      }
    }
    else
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "openDropdownLight.svg";
      }
      else
      {
        return "openDropdownDark.svg";
      }
    }
  });

  getOpenCloseLanguageImg = computed(() => {
    if(this.showLanguageOptions())
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "closeDropdownLight.svg";
      }
      else
      {
        return "closeDropdownDark.svg";
      }
    }
    else
    {
      if(this.CurrentTheme() == this.Light())
      {
        return "openDropdownLight.svg";
      }
      else
      {
        return "openDropdownDark.svg";
      }
    }
  });

  // boolean returns true if milestone label format options drop down is displaying
  showMilestoneLabelFormatOptions = computed(() => {
    return this.appService.show().setMilestoneLabelFormat;
  });

  // shows / hides the milestone label format options drop down
  openMilestoneLabelFormatOptions()
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.setMilestoneLabelFormat = !(this.appService.show().setMilestoneLabelFormat);
    newShow.setTimeRemaining = false;
    newShow.notificationSetting = false;
    newShow.language = false;

    this.appService.show.set(newShow);
  }

  getMilestoneLabelFormat = computed(() => {
    return this.settingsService.settings().milestoneLabelFormat;
  });

  setMilestoneLabelFormat(newSetting: MilestoneLabelFormat)
  {
    this.settingsService.setMilestoneLabelFormat(newSetting);

    this.openMilestoneLabelFormatOptions();
  }


  // boolean returns true if notifications options drop down is displaying
  showNotificationsOptions = computed(() => {
    return this.appService.show().notificationSetting;
  });

  // shows / hides the notifications options drop down
  openNotificationsOptions()
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.notificationSetting = !(this.appService.show().notificationSetting);
    newShow.setTimeRemaining = false;
    newShow.setMilestoneLabelFormat = false;
    newShow.language = false;

    this.appService.show.set(newShow);
  }

  getNotificationSetting = computed(() => {
    return this.settingsService.settings().notifications;
  });

  setNotificationSetting(newSetting: NotificationSetting)
  {
    this.settingsService.setNotifications(newSetting);

    this.openNotificationsOptions();
  }


  // boolean returns true if language options drop down is displaying
  showLanguageOptions = computed(() => {
    return this.appService.show().language;
  });

  // shows / hides the language options drop down
  openLanguageOptions()
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.language = !(this.appService.show().language);
    newShow.setTimeRemaining = false;
    newShow.setMilestoneLabelFormat = false;
    newShow.notificationSetting = false;

    this.appService.show.set(newShow);
  }

  getLanguage = computed(() => {
    return this.settingsService.settings().language;
  });

  setLanguage(newSetting: Language)
  {
    this.settingsService.setLanguage(newSetting);

    this.openLanguageOptions();
  }


  showWallpaperLight = computed(() => {
    return this.appService.show().wallpaperLight;
  });

  openWallpaperLight()
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.wallpaperLight = true;
    newShow.wallpaperDark = false;

    this.appService.show.set(newShow);
  }

  showWallpaperDark = computed(() => {
    return this.appService.show().wallpaperDark;
  });

  openWallpaperDark()
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.wallpaperLight = false;
    newShow.wallpaperDark = true;

    this.appService.show.set(newShow);
  }

  setWallpaperLight(newSetting: Wallpaper)
  {
    this.settingsService.setWallpaperLight(newSetting);
  }

  setWallpaperDark(newSetting: Wallpaper)
  {
    this.settingsService.setWallpaperDark(newSetting);
  }

  getWallpaperLight = computed(() => {
    return this.settingsService.settings().wallpaperLight
  });

  getWallpaperDark = computed(() => {
    return this.settingsService.settings().wallpaperDark
  });

  setCustomWallpaper()
  {
    this.settingsService.setCustomWallpaper(this.customWallpaperUrl());
  }

  getCustomBackgroundIconImage = computed(() => {
    return this.customWallpaperUrl().length == 0 ? 'customBackgroundThumbnailPlaceholder.svg' : this.customWallpaperUrl()
  });

  showResetYear = computed(() => {
    return this.appService.show().resetYear;
  });

  showResetEmpty = computed(() => {
    return this.appService.show().resetEmpty;
  });

  showResetSettings = computed(() => {
    return this.appService.show().resetSettings;
  });

  openResetYear(isOpen: boolean = true)
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.resetYear = isOpen;

    this.appService.show.set(newShow);
  }

  openResetEmpty(isOpen: boolean = true)
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.resetEmpty = isOpen;

    this.appService.show.set(newShow);
  }

  openResetSettings(isOpen: boolean = true)
  {
    var newShow: Show = { ...this.appService.show() };

    newShow.resetSettings = isOpen;

    this.appService.show.set(newShow);
  }

  resetYear()
  {
    this.settingsService.resetYear();

    this.openResetYear(false);
  }

  resetEmpty()
  {
    this.settingsService.resetEmpty();

    this.openResetEmpty(false);
  }

  resetSettings()
  {
    this.settingsService.resetSettings();

    this.customWallpaperUrl.set("");

    this.openResetSettings(false);
  }
}
