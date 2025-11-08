import { computed, Inject, Injectable, Renderer2, RendererFactory2, signal, DOCUMENT } from "@angular/core";
import { Language, MilestoneLabelFormat, NotificationSetting, Phrases, Settings, Theme, TimeRemainingText, Wallpaper } from "./settings.model";
import { AppService } from "../../app.service";

import { Countdown } from "../../app.model";

@Injectable({
    providedIn: 'root'
})
export class SettingsService
{
    settings = signal<Settings>({
        timeRemainingText: TimeRemainingText.Days,
        milestoneLabelFormat: MilestoneLabelFormat.Name,
        wallpaperLight: Wallpaper.Default,
        wallpaperDark: Wallpaper.Default,
        customWallpaperUrl: "",
        theme: Theme.Light,
        autoTheme: true,
        language: Language.English,
        notifications: NotificationSetting.Both
    });

    englishPhrases: Phrases =
    {
        day: "day",
        days: "days",
        week: "week",
        weeks: "weeks",
        month: "month",
        months: "months",
        remaining: "remaining",
        remainingUntil: "remaining until",
        completed: "completed",
        sinceStart: "since start",
        milestonesCompletedToday: "milestones completed today"
    }
    frenchPhrases: Phrases =
    {
        day: "jour",
        days: "jours",
        week: "semaine",
        weeks: "semaines",
        month: "mois",
        months: "mois",
        remaining: "restant",
        remainingUntil: "restant jusqu'à",
        completed: "terminé",
        sinceStart: "depuis le début",
        milestonesCompletedToday: "jalons terminées aujourd'hui"
    }
    germanPhrases: Phrases =
    {
        day: "tag",
        days: "tage",
        week: "woche",
        weeks: "wochen",
        month: "monat",
        months: "monate",
        remaining: "verbleibende",
        remainingUntil: "verbleibende bis",
        completed: "abgeschlossen",
        sinceStart: "seit dem start",
        milestonesCompletedToday: "meilensteine heute abgeschlossen"
    }
    spanishPhrases: Phrases =
    {
        day: "día",
        days: "días",
        week: "semana",
        weeks: "semanas",
        month: "mes",
        months: "meses",
        remaining: "restantes",
        remainingUntil: "restantes hasta",
        completed: "terminado",
        sinceStart: "desde el comienzo",
        milestonesCompletedToday: "hitos terminado hoy"
    }
    portuguesePhrases: Phrases =
    {
        day: "dia",
        days: "dias",
        week: "semana",
        weeks: "semanas",
        month: "mês",
        months: "meses",
        remaining: "restantes",
        remainingUntil: "restantes até",
        completed: "concluído",
        sinceStart: "desde o começo",
        milestonesCompletedToday: "marcos concluídos hoje"
    }
    italianPhrases: Phrases =
    {
        day: "giorno",
        days: "giorni",
        week: "settimana",
        weeks: "settimane",
        month: "mese",
        months: "mesi",
        remaining: "rimanenti",
        remainingUntil: "rimanenti fino a",
        completed: "completato",
        sinceStart: "dall'inizio",
        milestonesCompletedToday: "pietra miliares completati oggi"
    }
    polishPhrases: Phrases =
    {
        day: "dzień",
        days: "dni",
        week: "tydzień",
        weeks: "tygodnie",
        month: "miesiąc",
        months: "miesiące",
        remaining: "pozostały",
        remainingUntil: "pozostało do",
        completed: "zakończony",
        sinceStart: "od początku",
        milestonesCompletedToday: "kamieni milowych ukończonych dzisiaj"
    }
    russianPhrases: Phrases =
    {
        day: "день",
        days: "дней",
        week: "неделя",
        weeks: "недели",
        month: "месяц",
        months: "месяца",
        remaining: "осталось",
        remainingUntil: "осталось до",
        completed: "завершенный",
        sinceStart: "с начала",
        milestonesCompletedToday: "вехи, завершенные сегодня"
    }
    phrases = signal<Phrases>(this.englishPhrases);

    private renderer: Renderer2;

    constructor(private appService: AppService, @Inject(DOCUMENT) private document: Document, private rendererFactory: RendererFactory2)
    {
        this.renderer = rendererFactory.createRenderer(null, null);

        if(localStorage["settings"] !== undefined)
        {
            try
            {
                var previousSettings: Settings = JSON.parse(localStorage["settings"]);

                this.settings.set(previousSettings);
            }
            catch (e)
            {
                console.log("settings data invalid.");
                throw e;
            }
        }

        // dark mode media query
        var themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Initialising theme if auto theme is on
        if(this.settings().autoTheme)
        {
            var newSettings: Settings = { ...this.settings() };

            newSettings.theme = themeQuery.matches ? Theme.Dark : Theme.Light;

            this.settings.set(newSettings);

            console.log("Theme: " + this.settings().theme);
        }

        // Theme changes every time system theme changes when auto theme is on
        themeQuery.addEventListener('change', (event: MediaQueryListEvent) => {
            if(this.settings().autoTheme)
            {
                var newSettings: Settings = {...this.settings()};

                newSettings.theme = themeQuery.matches ? Theme.Dark : Theme.Light;
    
                this.settings.set(newSettings);

                console.log("Theme: " + this.settings().theme);

                this.updateAppWallpaper();
            }
        });

        this.updateAppWallpaper();

        this.setPhrases(this.settings().language);
    }


    setTimeRemainingText(newSetting: TimeRemainingText)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.timeRemainingText = newSetting;

        this.settings.set(newSettings);
    }

    setMilestoneLabelFormat(newSetting: MilestoneLabelFormat)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.milestoneLabelFormat = newSetting;

        this.settings.set(newSettings);
    }

    setTheme(newSetting: Theme)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.theme = newSetting;
        newSettings.autoTheme = false;

        this.settings.set(newSettings);

        this.updateAppWallpaper();
    }

    setAutoTheme()
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.autoTheme = true;

        // Setting the theme to the system theme
        var themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        newSettings.theme = themeQuery.matches ? Theme.Dark : Theme.Light;

        this.settings.set(newSettings);

        this.updateAppWallpaper();
    }

    themeIsLight = computed(() => {
        return this.settings().theme == Theme.Light && this.settings().autoTheme == false
    });

    themeIsDark = computed(() => {
        return this.settings().theme == Theme.Dark && this.settings().autoTheme == false
    });

    themeIsAuto = computed(() => {
        return this.settings().autoTheme == true
    });

    setLanguage(newSetting: Language)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.language = newSetting;

        this.setPhrases(newSettings.language);

        this.settings.set(newSettings);
    }

    private setPhrases(language: Language)
    {
        if (language == Language.English)
        {
            this.phrases.set(this.englishPhrases);
        }
        else if (language == Language.French)
        {
            this.phrases.set(this.frenchPhrases);
        }
        else if (language == Language.German)
        {
            this.phrases.set(this.germanPhrases);
        }
        else if (language == Language.Spanish)
        {
            this.phrases.set(this.spanishPhrases);
        }
        else if (language == Language.Portuguese)
        {
            this.phrases.set(this.portuguesePhrases);
        }
        else if (language == Language.Italian)
        {
            this.phrases.set(this.italianPhrases);
        }
        else if (language == Language.Polish)
        {
            this.phrases.set(this.polishPhrases);
        }
        else if (language == Language.Russian)
        {
            this.phrases.set(this.russianPhrases);
        }
    }

    setNotifications(newSetting: NotificationSetting)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.notifications = newSetting;

        this.settings.set(newSettings);
    }

    setWallpaperLight(newSetting: Wallpaper)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.wallpaperLight = newSetting;

        this.settings.set(newSettings);

        this.updateAppWallpaper();
    }

    setWallpaperDark(newSetting: Wallpaper)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.wallpaperDark = newSetting;

        this.settings.set(newSettings);

        this.updateAppWallpaper();
    }

    setCustomWallpaper(newSetting: string)
    {
        let newSettings: Settings = {...this.settings()};

        newSettings.customWallpaperUrl = newSetting;

        this.settings.set(newSettings);

        this.updateAppWallpaper();

        console.log("Was setCustomWallpaper called?");
    }

    saveSettings()
    {
        localStorage["settings"] = JSON.stringify(this.settings());
    }

    private updateAppWallpaper()
    {
        // Setting background to light wallpaper
        if(this.settings().theme == Theme.Light)
        {
            // If the selected background is a non-custom image then the wallpaperLight enum property is used for backgroundImage
            if(!(this.settings().wallpaperLight == Wallpaper.Custom) && !(this.settings().wallpaperLight == Wallpaper.Default))
            {
                var backgroundUrlValue = "url(" + this.settings().wallpaperLight + ")";

                this.renderer.setStyle(this.document.body, "backgroundImage", backgroundUrlValue);
            }
            // If background is set to Custom then customWallpaperUrl property is used for backgroundImage
            else if(this.settings().wallpaperLight == Wallpaper.Custom)
            {
                var backgroundUrlValue = "url(" + this.settings().customWallpaperUrl + ")";

                this.renderer.setStyle(this.document.body, "backgroundImage", backgroundUrlValue);
            }
            // If background is set to Default then backgroundColor is set instead of image
            else if(this.settings().wallpaperLight == Wallpaper.Default)
            {
                this.renderer.setStyle(this.document.body, "backgroundImage", "none");
                this.renderer.setStyle(this.document.body, "backgroundColor", "#fff");
            }
        }
        // Setting background to dark wallpaper
        else if(this.settings().theme == Theme.Dark)
        {
            // If the selected background is a non-custom image then the wallpaperDark enum property is used for backgroundImage
            if(!(this.settings().wallpaperDark == Wallpaper.Custom) && !(this.settings().wallpaperDark == Wallpaper.Default))
            {
                var backgroundUrlValue = "url(" + this.settings().wallpaperDark + ")";

                this.renderer.setStyle(this.document.body, "backgroundImage", backgroundUrlValue);
            }
            // If background is set to Custom then customWallpaperUrl property is used for backgroundImage
            else if(this.settings().wallpaperDark == Wallpaper.Custom)
            {
                var backgroundUrlValue = "url(" + this.settings().customWallpaperUrl + ")";

                this.renderer.setStyle(this.document.body, "backgroundImage", backgroundUrlValue);
            }
            // If background is set to Default then backgroundColor is set instead of image
            else if(this.settings().wallpaperDark == Wallpaper.Default)
            {
                this.renderer.setStyle(this.document.body, "backgroundImage", "none");
                this.renderer.setStyle(this.document.body, "backgroundColor", "#000");
            }
        }
    }

    resetYear()
    {
        let defaultCountdown: Countdown =
        {
            name: "",
            endMessage: "",
            startDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
            endDate: new Date(Date.UTC(new Date().getFullYear()+1, 0, 1)),
            notified: false,
            milestones: [
                {
                    name: "new milestone",
                    date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)),
                    notes: "",
                    notified: false
                }
            ]
        };

        this.appService.selectMilestone(-1); // De-selecting any milestones that might have been deleted

        this.appService.updateCountdown(this.appService.selected().countdown, defaultCountdown);
    }
  
    resetEmpty()
    {
        let defaultCountdown: Countdown =
        {
            name: "",
            endMessage: "",
            startDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
            endDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10)),
            notified: false,
            milestones: [
                {
                    name: "new milestone",
                    date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)),
                    notes: "",
                    notified: false
                }
            ]
        };

        this.appService.selectMilestone(-1); // De-selecting any milestones that might have been deleted

        this.appService.updateCountdown(this.appService.selected().countdown, defaultCountdown);
    }
  
    resetSettings()
    {
        this.settings.set({
            timeRemainingText: TimeRemainingText.Days,
            milestoneLabelFormat: MilestoneLabelFormat.Name,
            wallpaperLight: Wallpaper.Default,
            wallpaperDark: Wallpaper.Default,
            customWallpaperUrl: "",
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light,
            autoTheme: true,
            language: Language.English,
            notifications: NotificationSetting.Both
          });

          this.updateAppWallpaper();
          this.setPhrases(Language.English);
    }
}