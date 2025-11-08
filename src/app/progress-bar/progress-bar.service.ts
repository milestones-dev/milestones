import { computed, Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { SettingsService } from "../edit-settings-about/settings/settings.service";
import { MilestoneLabelFormat, Theme, TimeRemainingText } from "../edit-settings-about/settings/settings.model";

@Injectable({providedIn: 'root'})
export class ProgressBarService
{
    constructor(private appService: AppService, private settingsService: SettingsService){}

    // Gets percentage between start and end of current countdown
    getBarLength = computed(() => {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let startDate = this.appService.current().startDate.getTime();
        let endDate = this.appService.current().endDate.getTime();

        let percentage = ((currentDate - startDate) / (endDate - startDate)) * 100;

        // Capping percentage at 100%
        if(percentage > 100)
        {
            return 100;
        }

        return percentage;
    });

    getBarColour = computed(() => {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let barColour = "#000";

        // default bar colour for dark / light mode
        if(this.settingsService.settings().theme == Theme.Dark)
        {
            barColour = "rgb(117, 117, 117)";
        }
        else
        {
            barColour = "#000";
        }

        // If current date is on milestone date then bar is blue
        for(let milestone of this.appService.current().milestones)
        {
            if(milestone.date.getTime() == currentDate)
            {
                barColour = "#218dff";
            }
        }

        // If countdown is complete then bar is green
        if(currentDate >= this.appService.current().endDate.getTime())
        {
            barColour = "#00c6a1";
        }

        return barColour;
    });

    // Same as getBarLength but rounded to 1 decimal place
    getPercentageLabelText = computed(() => {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let startDate = this.appService.current().startDate.getTime();
        let endDate = this.appService.current().endDate.getTime();

        let percentage = ((currentDate - startDate) / (endDate - startDate)) * 100;

        // Capping percentage at 100
        if(percentage > 100)
        {
            percentage = 100;
        }

        return this.roundNumber(percentage, 1);
    });

    getMilestones = computed(() => {
        return this.appService.current().milestones;
    });

    // Gets percentage of milestone date between start and end dates
    getMilestoneOffset(index: number)
    {
        return computed(() => {
            let milestoneDate = this.appService.current().milestones[index].date.getTime();
            let startDate = this.appService.current().startDate.getTime();
            let endDate = this.appService.current().endDate.getTime();

            return ((milestoneDate - startDate) / (endDate - startDate)) * 100;
        });
    }

    getTimeRemaining = computed(() => {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let endDate = this.appService.current().endDate.getTime();
        let daysRemaining = (endDate - currentDate)/86400000;
        let messageToDisplay = "";

        // Capping days remaining at 0
        if(daysRemaining < 0)
        {
            messageToDisplay = "0 " + this.settingsService.phrases().days;
        }
        else // If there are 0 or more days left then this is formatted according to settings
        {
            if(this.settingsService.settings().timeRemainingText == TimeRemainingText.Days)
            {
                messageToDisplay = this.getDaysRemainingText(daysRemaining);
            }
            else if(this.settingsService.settings().timeRemainingText == TimeRemainingText.Weeks)
            {
                messageToDisplay = this.getWeeksRemainingText(daysRemaining);
            }
            else if(this.settingsService.settings().timeRemainingText == TimeRemainingText.Months)
            {
                if(daysRemaining < 30)
                {
                    messageToDisplay = this.getWeeksRemainingText(daysRemaining);
                }
                else
                {
                    let numberOfMonths = Math.trunc(daysRemaining / 30);
                    let numberofWeeks = Math.trunc((daysRemaining % 30)/7);
                    let numberOfDays = (daysRemaining % 30) % 7;
        
                    messageToDisplay = numberOfMonths == 1 ? numberOfMonths + " " + this.settingsService.phrases().month : numberOfMonths + " " + this.settingsService.phrases().months;
        
                    if(numberofWeeks != 0)
                    {
                        messageToDisplay += numberofWeeks == 1 ? ", " + numberofWeeks + " " + this.settingsService.phrases().week : ", " + numberofWeeks + " " + this.settingsService.phrases().weeks;
                    }
        
                    if(numberOfDays != 0)
                    {
                        messageToDisplay += numberOfDays == 1 ? ", " + numberOfDays + " " + this.settingsService.phrases().day : ", " + numberOfDays + " " + this.settingsService.phrases().days;
                    }
                }
            }
            else if(this.settingsService.settings().timeRemainingText == TimeRemainingText.MonthsDays)
            {
                if(daysRemaining < 30)
                {
                    messageToDisplay = this.getDaysRemainingText(daysRemaining);
                }
                else
                {
                    let numberOfMonths = Math.trunc(daysRemaining / 30);
                    let numberOfDays = daysRemaining % 30;
        
                    messageToDisplay = numberOfMonths == 1 ? numberOfMonths + " " + this.settingsService.phrases().month : numberOfMonths + " " + this.settingsService.phrases().months;
        
                    if(numberOfDays != 0)
                    {
                        messageToDisplay += numberOfDays == 1 ? ", " + numberOfDays + " " + this.settingsService.phrases().day : ", " + numberOfDays + " " + this.settingsService.phrases().days;
                    }
                }
            }
        }

        // Either "remaining" or "remaining until <name>" is displayed if countdown name not empty
        let remainingText = " " + this.settingsService.phrases().remaining;
        if(this.appService.current().name.length > 0)
        {
            remainingText = " " + this.settingsService.phrases().remainingUntil + " " + this.appService.current().name;
        }

        // End message is displayed if not empty and countdown has finished
        if(daysRemaining < 1 && this.appService.current().endMessage.length > 0)
        {
            return this.appService.current().endMessage;
        }

        return messageToDisplay + remainingText;
    });

    private getDaysRemainingText(daysRemaining: number)
    {
        return daysRemaining == 1 ? daysRemaining + " " + this.settingsService.phrases().day : daysRemaining + " " + this.settingsService.phrases().days;
    }

    private getWeeksRemainingText(daysRemaining: number)
    {
        if(daysRemaining < 7)
        {
            return this.getDaysRemainingText(daysRemaining);
        }
        
        let numberOfWeeks = Math.trunc(daysRemaining / 7);
        let numberOfDays = daysRemaining % 7;

        if(numberOfDays == 0)
        {
            return numberOfWeeks == 1 ? numberOfWeeks + " " + this.settingsService.phrases().week : numberOfWeeks + " " + this.settingsService.phrases().weeks;
        }

        return (numberOfWeeks == 1 ? numberOfWeeks + " " + this.settingsService.phrases().week + ", " : numberOfWeeks + " " + this.settingsService.phrases().weeks + ", ") + this.getDaysRemainingText(numberOfDays);
    }

    getMilestoneLabelText(index: number)
    {
        return computed(() => {

            if(this.settingsService.settings().milestoneLabelFormat == MilestoneLabelFormat.Name)
            {
                return this.appService.current().milestones[index].name.length == 0 ? "milestone " + (index + 1) : this.appService.current().milestones[index].name;
            }
            else if(this.settingsService.settings().milestoneLabelFormat == MilestoneLabelFormat.Date)
            {
                let milestoneDate = this.appService.current().milestones[index].date;

                return (milestoneDate.getDate()) + "/" + (milestoneDate.getMonth()+1) + "/" + (milestoneDate.getFullYear())
            }
            else if(this.settingsService.settings().milestoneLabelFormat == MilestoneLabelFormat.Percentage)
            {
                let milestoneDate = this.appService.current().milestones[index].date.getTime();
                let startDate = this.appService.current().startDate.getTime();
                let endDate = this.appService.current().endDate.getTime();

                let milestonePercentage = ((milestoneDate - startDate) / (endDate - startDate)) * 100

                return this.roundNumber(milestonePercentage, 1) + "%";
            }
            else if(this.settingsService.settings().milestoneLabelFormat == MilestoneLabelFormat.DayNumber)
            {
                let milestoneDate = this.appService.current().milestones[index].date.getTime();
                let startDate = this.appService.current().startDate.getTime();
                let dayNumber = (milestoneDate - startDate)/86400000;

                return this.settingsService.phrases().day + " " + dayNumber;
            }
        
            return this.appService.current().milestones[index].name.length == 0 ? "milestone " + (index + 1) : this.appService.current().milestones[index].name; // default case
        });
    }

    selectMilestone(index: number)
    {
        // milestone is selected if not already otherwise it is deselected
        if(this.isSelectedMilestone(index)() == false)
        {
            this.appService.selectMilestone(index);
        }
        else
        {
            this.appService.selectMilestone(-1);
        }
    }

    isSelectedMilestone(index: number)
    {
        return computed(() => {
            return index === this.appService.selected().milestone;
        });
    }

    private roundNumber(num: number, decimalPlaces: number)
    {
        let decimalPlacesFactor = Math.pow(10, decimalPlaces);

        return Math.round(num * decimalPlacesFactor) / decimalPlacesFactor;
    }
}