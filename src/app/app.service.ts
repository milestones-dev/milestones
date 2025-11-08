import { computed, Injectable, signal } from "@angular/core";
import { Countdown, Selected, Show } from './app.model';

@Injectable({providedIn: 'root'})
export class AppService
{
    countdowns = signal<Countdown[]>([]);
    show = signal<Show>({countdownsMenu: false,
        milestonesInfo: false,
        milestonesList: true,
        milestonesNotes: false,
        notificationsList: false,
        editSettingsAboutContainer: false,
        edit: true,
        settings: false,
        setTimeRemaining: false,
        setMilestoneLabelFormat: false,
        wallpaperLight: true,
        wallpaperDark: false,
        language: false,
        notificationSetting: false,
        resetEmpty: false,
        resetYear: false,
        resetSettings: false,
        about: false,
        deleteMilestoneButtons: false,
        deleteCountdownButtons: false,
        exportCountdownDialog: false,
        sidebarMobile: false,
        validationErrorsDialogEdit: false,
        validationErrorsDialogImport: false,
        countdownsMenuDeleteButtons: false,
        countdownsMenuDeleteConfirm: false,
        countdownsMenuAddOptions: false,
        countdownsMenuImportDialog: false
    });
    selected = signal<Selected>({countdown: 0, milestone: -1});

    constructor()
    {
        // Initialising countdowns array with default values or previous values from localStorage
        let defaultCountdown: Countdown =
        {
            name: "",
            endMessage: "",
            startDate: new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ),
            endDate: new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+10) ),
            notified: false,
            milestones: [
                {
                    name: "new milestone",
                    date: new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1) ),
                    notes: "",
                    notified: false
                }
            ]
        };
        this.countdowns.set([defaultCountdown]);

        if(localStorage["countdowns"] !== undefined)
        {
            try
            {
                let previousCountdowns: Countdown[] = JSON.parse(localStorage["countdowns"]);

                for(let countdown of previousCountdowns)
                {
                    countdown.startDate = new Date(countdown.startDate);
                    countdown.endDate = new Date(countdown.endDate);
                    
                    for(let milestone of countdown.milestones)
                    {
                        milestone.date = new Date(milestone.date);
                    }
                }

                this.countdowns.set(previousCountdowns);
            }
            catch(e)
            {
                console.log("countdowns data invalid.");
                throw e;
            }
        }

        // Initialising selected object
        if(localStorage["selected"] !== undefined)
        {
            try
            {
                let previousSelected: Selected = JSON.parse(localStorage["selected"]);
                this.selected.set(previousSelected);
            }
            catch(e)
            {
                console.log("selected data invalid.");
                throw e;
            }
        }
    }

    addCountdown(newCountdown: Countdown)
    {
        this.countdowns.set([...this.countdownsCopy(), newCountdown]);
    }

    switchCountdown(index: number)
    {
        this.selectMilestone(-1);
        this.selectCountdown(index);
        this.saveSelected();

        this.triggerUpdate();
    }

    // This method triggers the UI to update the countdown by re-assigning the same values
    triggerUpdate()
    {
        let sameCountdowns = [...this.countdownsCopy()];

        this.countdowns.set(sameCountdowns);
    }

    updateCountdown(index: number, updatedCountdown: Countdown)
    {
        let newCountdowns = [...this.countdownsCopy()];

        newCountdowns[index] = updatedCountdown;

        this.countdowns.set(newCountdowns);
    }

    updateCurrentCountdown(updatedCountdown: Countdown)
    {
        this.updateCountdown(this.selected().countdown, updatedCountdown);
    }

    deleteCountdown(index: number)
    {
        let newCountdowns = this.countdowns().filter((_, i) => i !== index);

        this.countdowns.set(newCountdowns);
    }

    saveCountdowns()
    {
        localStorage["countdowns"] = JSON.stringify(this.countdowns());
    }

    saveSelected()
    {
        localStorage["selected"] = JSON.stringify(this.selected());
    }

    selectCountdown(index: number)
    {
        let newSelected: Selected = {...this.selected()};

        newSelected.countdown = index;

        this.selected.set(newSelected);
    }

    selectMilestone(index: number)
    {
        let newSelected: Selected = {...this.selected()};

        newSelected.milestone = index;

        this.selected.set(newSelected);
    }

    current = computed(() => {
        return this.countdowns()[this.selected().countdown];
    });
    

    countdownsCopy()
    {
        let countdownsCopiedByValue: Countdown[] = JSON.parse( JSON.stringify(this.countdowns()) );

        for(let countdown of countdownsCopiedByValue)
        {
            countdown.startDate = new Date(countdown.startDate);
            countdown.endDate = new Date(countdown.endDate);

            for (let milestone of countdown.milestones)
            {
                milestone.date = new Date(milestone.date);
            }
        }

        return countdownsCopiedByValue;
    }

    currentCountdownCopy()
    {
        let countdownCopiedByValue: Countdown = JSON.parse( JSON.stringify(this.current()) );

        countdownCopiedByValue.startDate = new Date(countdownCopiedByValue.startDate);
        countdownCopiedByValue.endDate = new Date(countdownCopiedByValue.endDate);

        for (let milestone of countdownCopiedByValue.milestones)
        {
            milestone.date = new Date(milestone.date);
        }

        return countdownCopiedByValue;
    }
}