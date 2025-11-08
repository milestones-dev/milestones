import { computed, Injectable, signal } from "@angular/core";
import { AppService } from "../app.service";
import { Countdown, Selected, Show } from "../app.model";
import { EditService } from "../edit-settings-about/edit/edit.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable({providedIn: 'root'})
export class CountdownsMenuService
{
    constructor(private appService: AppService, private editService: EditService, private notificationService: NotificationsService){}

    COUNTDOWN_COUNT_LIMIT = signal<number>(30);

    countdowns = computed(() => {
        return this.appService.countdowns();
    });

    getBarLength(index: number)
    {
        return computed(() => {

            let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
            let startDate = this.appService.countdowns()[index].startDate.getTime();
            let endDate = this.appService.countdowns()[index].endDate.getTime();

            let percentage = ((currentDate - startDate) / (endDate - startDate)) * 100;

            // Capping percentage at 100%
            if(percentage > 100)
            {
                return 100;
            }

            return percentage;
        });
    }

    switchCountdown(index: number)
    {
        this.appService.switchCountdown(index);
        this.notificationService.deleteNotificationsByCountdown(index);

        this.closeMenu();
    }

    addCountdown(isYearToYear = false)
    {
        let newCountdown: Countdown;

        if(!isYearToYear)
        {
            newCountdown =
            {
                name: "",
                endMessage: "",
                startDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
                endDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10)),
                notified: false,
                milestones:
                [
                    {
                        name: "new milestone",
                        date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)),
                        notes: "",
                        notified: false
                    }
                ]
            };
        }
        else
        {
            newCountdown =
            {
                name: "",
                endMessage: "",
                startDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
                endDate: new Date(Date.UTC(new Date().getFullYear()+1, 0, 1)),
                notified: false,
                milestones:
                [
                    {
                        name: "new milestone",
                        date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)),
                        notes: "",
                        notified: false
                    }
                ]
            };
        }

        // A new countdown will not be added if already at limit
        if(this.countdownCountWithinLimit())
        {
            this.appService.addCountdown(newCountdown);
            this.appService.saveCountdowns();
            this.switchCountdown(this.appService.countdowns().length-1);
        }        

        this.closeMenu();

        console.log(newCountdown);
    }

    countdownCountWithinLimit = computed(() => {
        return this.appService.countdowns().length < this.COUNTDOWN_COUNT_LIMIT();
    });

    deleteCountdown(index: number)
    {
        if(this.appService.countdowns().length > 1)
        {
            // If the selected countdown has been deleted then switch to the first countdown in list
            if(this.appService.selected().countdown == index)
            {
                this.switchCountdown(0);
            }

            // If the selected countdown is below the deleted one it will move down one space in the array, so the app will switch down one space to remain on the same countdown
            if(this.appService.selected().countdown > index)
            {
                this.switchCountdown(this.appService.selected().countdown - 1);
            }

            this.appService.deleteCountdown(index);
            this.notificationService.deleteNotificationsByCountdown(index);
            this.appService.saveCountdowns();

            this.closeMenu();
        }
    }

    importCountdown(importedCountdownText: string)
    {
        let isImportedCountdownTextValid = this.validateImportedCountdown(importedCountdownText);

        if(isImportedCountdownTextValid)
        {
            try
            {
                let importedCountdown: Countdown = JSON.parse(importedCountdownText);

                // Converting strings to Dates for Date fields
                importedCountdown.startDate = new Date(importedCountdown.startDate);
                importedCountdown.endDate = new Date(importedCountdown.endDate);
                    
                for(let milestone of importedCountdown.milestones)
                {
                    milestone.date = new Date(milestone.date);
                }
                
                if(this.countdownCountWithinLimit())
                {
                    this.appService.addCountdown(importedCountdown);
                    this.appService.saveCountdowns();
                    this.switchCountdown(this.appService.countdowns().length-1);
                }
                else
                {
                    return false;
                }
            }
            catch(e)
            {
                return false;
            }

            return true;
        }
        else
        {
            return false;
        }
        
    }

    validateImportedCountdown(importedJSON: string)
    {
        let importedCountdown: Countdown;

        if(importedJSON.length == 0)
        {
            return false;
        }

        // Checking that the text is valid JSON
        try
        {
            importedCountdown = JSON.parse(importedJSON);
        }
        catch(e)
        {
            return false;
        }

        // Checking that the JSON text is a valid Countdown object and has the correct fields
        if(Object.keys(importedCountdown).length != 6)
        {
            return false;
        }

        if( !(importedCountdown.hasOwnProperty("startDate")) )
        {
            return false;
        }

        if( !(importedCountdown.hasOwnProperty("endDate")) )
        {
            return false;
        }

        if( !(importedCountdown.hasOwnProperty("name")) )
        {
            return false;
        }

        if( !(importedCountdown.hasOwnProperty("endMessage")) )
        {
            return false;
        }

        if( !(importedCountdown.hasOwnProperty("notified")) )
        {
            return false;
        }

        if( !(importedCountdown.hasOwnProperty("milestones")
            && Array.isArray(importedCountdown.milestones)
            && importedCountdown.milestones.length <= this.editService.MILESTONE_COUNT_LIMIT()) )
        {
            return false;
        }
        else // Checking that each milestone object is valid
        {
            for(let milestone of importedCountdown.milestones)
            {
                if(Object.keys(milestone).length != 4)
                {
                    return false;
                }

                if( !(milestone.hasOwnProperty("name")) )
                {
                    return false;
                }

                if( !(milestone.hasOwnProperty("date")) )
                {
                    return false;
                }

                if( !(milestone.hasOwnProperty("notes")) )
                {
                    return false;
                }

                if( !(milestone.hasOwnProperty("notified")) )
                {
                    return false;
                }
            }
        }

        // Converting strings to Dates for date fields before value and data type check
        importedCountdown.startDate = new Date(importedCountdown.startDate);
        importedCountdown.endDate = new Date(importedCountdown.endDate);
                    
        for(let milestone of importedCountdown.milestones)
        {
            milestone.date = new Date(milestone.date);
        }

        // Checking that the Countdown object in the JSON has valid values and data types
        let valueCheckErrors = this.editService.validateCountdown(importedCountdown);

        if(valueCheckErrors.length != 0)
        {
            return false;
        }

        return true;
    }

    private closeMenu()
    {
        let newShow: Show = {...this.appService.show()};
                
        newShow.countdownsMenu = false;
        newShow.countdownsMenuAddOptions = false;
        newShow.countdownsMenuDeleteButtons = false;
        newShow.countdownsMenuDeleteConfirm = false;
        newShow.countdownsMenuImportDialog = false;
                
        this.appService.show.set(newShow);
    }
}