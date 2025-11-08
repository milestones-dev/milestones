import { computed, effect, Injectable, signal } from "@angular/core";
import { Countdown, Milestone, Show } from "../../app.model";
import { AppService } from "../../app.service";
import { NotificationsService } from "../../notifications/notifications.service";

@Injectable({providedIn: 'root'})
export class EditService
{
    MILESTONE_COUNT_LIMIT = signal<number>(30);

    // This property contains the current coundown values being edited, and after validation are copied over to the app service countdowns array
    edit = signal<Countdown>({
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
    });

    validationErrorsString = signal<string[]>([]);

    constructor(private appService: AppService, private notificationsService: NotificationsService)
    {
        // Assigning a copy of the current countdown values to the edit property whenever the current countdown changes, i.e. during a switch
        effect(() => {
            let copiedCountdown = JSON.parse(JSON.stringify(this.appService.current()));

            copiedCountdown.startDate = new Date(copiedCountdown.startDate);
            copiedCountdown.endDate = new Date(copiedCountdown.endDate);

            for (let milestone of copiedCountdown.milestones)
            {
                milestone.date = new Date(milestone.date);
            }

            this.edit.set({...copiedCountdown});

            console.log("effect has run.");
        });
    }

    validateAndSaveCountdown()
    {
        let validationErrors = this.validateCountdown(this.edit());
        if(validationErrors.length == 0)
        {
            this.appService.selectMilestone(-1); // De-selecting any milestones that might have been deleted
            this.appService.updateCurrentCountdown(this.edit());
            this.notificationsService.updateNotifiedPropertyAfterEdit();
            this.appService.saveCountdowns();

            return true;
        }
        else // Displaying error dialog if the edited countdown contains any errors
        {
            this.validationErrorsString.set(validationErrors);

            this.openErrorDialog(true);

            return false;
        }
    }

    validateCountdown(countdown: Countdown)
    {
        let errorList: string[] = [];
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let startDate = countdown.startDate.getTime();
        let endDate = countdown.endDate.getTime();

        // Checking the data types are valid
        if(isNaN(startDate))
        {
            errorList.push("The start date is not a valid date value");

            return errorList;
        }

        if(isNaN(endDate))
        {
            errorList.push("The end date is not a valid date value");

            return errorList;
        }

        if(!(countdown.notified === true || countdown.notified === false))
        {
            errorList.push("The countdown notified property does not contain a valid boolean value");
        }

        let i = 0;
        for(let milestone of countdown.milestones)
        {
            if(isNaN(milestone.date.getTime()))
            {
                errorList.push("The date of milestone '" + (milestone.name.length == 0 ? "milestone " + (i+1) : milestone.name) + "' is not a valid date value");

                return errorList;
            }

            if(!(milestone.notified === true || milestone.notified === false))
            {
                errorList.push("The notified property of milestone '" + (milestone.name.length == 0 ? "milestone " + (i+1) : milestone.name) + "' does not contain a valid boolean value");
            }

            i += 1;
        }

        let currentDateMinus5000Days = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 5000) );
        console.log("Current date - 5000 days = " + currentDateMinus5000Days);

        let startDatePlus5000Days = new Date( Date.UTC(countdown.startDate.getFullYear(), countdown.startDate.getMonth(), countdown.startDate.getDate() + 5000) );
        console.log("Start date + 5000 days = " + startDatePlus5000Days);

        // Checking the dates are within the valid range and the strings are of valid length
        if(!(startDate <= currentDate))
        {
            errorList.push("The start date (" + new Date(startDate).toDateString() + ") cannot be in the future");
        }

        if(!(startDate < endDate))
        {
            errorList.push("The start date (" + new Date(startDate).toDateString() + ") must come before the end date (" + new Date(endDate).toDateString() + ")");
        }

        if(!(startDate >= currentDateMinus5000Days.getTime()))
        {
            errorList.push("The start date (" + new Date(startDate).toDateString() + ") cannot be more than 5000 days ago");
        }

        let milestoneIndex = 0;
        for(let milestone of countdown.milestones)
        {
            let milestoneDate = milestone.date.getTime();

            if(!(milestoneDate >= startDate))
            {
                errorList.push("The date for the milestone '" + (milestone.name.length == 0 ? "milestone " + (milestoneIndex+1) : milestone.name) + "' cannot come before the start date (" + new Date(startDate).toDateString() + ")");
            }

            if(!(milestoneDate <= endDate) && (startDate < endDate)) // only checking milestoneDate <= endDate if the endDate is valid to reduce redundant errors
            {
                errorList.push("The date for the milestone '" + (milestone.name.length == 0 ? "milestone " + (milestoneIndex+1) : milestone.name) + "' cannot come after the end date (" + new Date(endDate).toDateString() + ")");
            }

            if(!(milestone.name.length <= 100))
            {
                errorList.push("The name for the milestone '" + milestone.name.substring(0, 100) + "' must be 100 characters long or less. The name is currently " + milestone.name.length + " characters long.");
            }

            if(!(milestone.notes.length <= 2000))
            {
                errorList.push("The notes for the milestone '" + (milestone.name.length == 0 ? "milestone " + (milestoneIndex+1) : milestone.name) + "' must be 2000 characters or less. The notes are currently " + milestone.notes.length + " characters long.");
            }

            milestoneIndex += 1;
        }

        if(!(endDate <= startDatePlus5000Days.getTime()))
        {
            errorList.push("The end date (" + new Date(endDate).toDateString() + ") cannot be more than 5000 days after the start date (" + new Date(startDate).toDateString() + ")");
        }

        if(!(countdown.name.length <= 100))
        {
            errorList.push("The countdown name must be 100 characters long or less. The name is currently " + countdown.name.length + " characters long.");
        }

        if(!(countdown.endMessage.length <= 100))
        {
            errorList.push("The countdown end message must be 100 characters long or less. The end message is currently " + countdown.endMessage.length + " characters long.");
        }

        return errorList;
    }

    openErrorDialog(isShow: boolean)
    {
        let newShow: Show = {...this.appService.show()};
                
        newShow.validationErrorsDialogEdit = isShow;
                
        this.appService.show.set(newShow);
    }

    addMilestone()
    {
        if(this.edit().milestones.length < this.MILESTONE_COUNT_LIMIT())
        {
            // hiding milestone delete buttons before adding new milestone
            let newShow: Show = {...this.appService.show()};
                
            newShow.deleteMilestoneButtons = false;
                
            this.appService.show.set(newShow);

            let newMilestone: Milestone =
            {
                name: "new milestone",
                date: new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1) ),
                notes: "",
                notified: false
            }

            let newEdit: Countdown = {...this.edit()};

            newEdit.milestones.push(newMilestone);

            this.edit.set(newEdit);
        }
    }

    deleteMilestone(index: number)
    {
        if(this.edit().milestones.length > 0)
        {
            let newEdit: Countdown = {...this.edit()};

            newEdit.milestones.splice(index, 1);

            this.edit.set(newEdit);
        }

        // milestone delete buttons hidden if no more milestones
        if(this.edit().milestones.length == 0)
        {
            let newShow: Show = {...this.appService.show()};
                
            newShow.deleteMilestoneButtons = false;
                
            this.appService.show.set(newShow);
        }
    }

    exportCountdown(isShow = true)
    {
        let newShow: Show = {...this.appService.show()};
                
        newShow.exportCountdownDialog = isShow;
                
        this.appService.show.set(newShow);
    }

    copyExportCountdownText()
    {
        navigator.clipboard.writeText(JSON.stringify(this.appService.current()));

        this.exportCountdown(false);
    }

    updateName(name: string)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.name = name;

        this.edit.set(newEdit);
    }

    updateEndMessage(message: string)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.endMessage = message;

        this.edit.set(newEdit);
    }

    updateStartDate(date: Date)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.startDate = date;

        this.edit.set(newEdit);
    }

    updateEndDate(date: Date)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.endDate = date;

        this.edit.set(newEdit);
    }

    updateMilestoneName(name: string, index: number)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.milestones[index].name = name;

        this.edit.set(newEdit);
    }

    updateMilestoneDate(date: Date, index: number)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.milestones[index].date = date;

        this.edit.set(newEdit);
    }

    updateMilestoneNotes(notes: string, index: number)
    {
        let newEdit: Countdown = {...this.edit()};

        newEdit.milestones[index].notes = notes;

        this.edit.set(newEdit);
    }
}