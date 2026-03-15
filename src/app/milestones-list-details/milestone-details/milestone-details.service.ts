import { computed, effect, Injectable, signal } from "@angular/core";
import { AppService } from "../../app.service";
import { Countdown } from "../../app.model";
import { NotificationsService } from "../../notifications/notifications.service";

@Injectable({providedIn: 'root'})
export class MilestoneDetailsService
{
    // These properties contain the current milestone notes, name and date being edited, and after validation are copied over to the app service countdowns array
    editNotes = signal<string>("");
    editName = signal<string>("");
    editDate = signal<Date>(new Date());

    showSaveButton = signal<boolean>(false);

    errorTextNotes = signal<string>("");
    errorTextName = signal<string>("");
    errorTextDate = signal<string>("");

    constructor(private appService: AppService, private notificationsService: NotificationsService)
    {
        // Assigning a copy of the current milestone notes, name and date to the relevant property whenever the selected milestone changes
        effect(() => {

            if(this.appService.selected().milestone != -1)
            {
                let selectedMilestone = this.appService.selected().milestone;
                let newNotes = this.appService.current().milestones[selectedMilestone].notes;
                let newName = this.appService.current().milestones[selectedMilestone].name;
                let newDate = new Date(this.appService.current().milestones[selectedMilestone].date);

                this.editNotes.set(newNotes);
                this.editName.set(newName);
                this.editDate.set(newDate);

                // Resetting error messages and hiding save button when new milestone selected
                this.showSaveButton.set(false);
                this.errorTextNotes.set("");
                this.errorTextName.set("");
                this.errorTextDate.set("");
            }
        });
    }

    selectedMilestoneName = computed(() => {

        if(this.appService.selected().milestone != -1)
        {
            let milestoneName = this.appService.current().milestones[this.appService.selected().milestone].name;

            return milestoneName.length == 0 ? ('milestone '+(this.appService.selected().milestone+1)) : milestoneName;
        }
        
        return "no milestone selected";
    });

    saveDetails()
    {
        // Saving notes, name and date to countdowns array by creating a deep copy and then assigning the new values to it
        let copiedCountdown: Countdown = JSON.parse(JSON.stringify(this.appService.current()));

        copiedCountdown.startDate = new Date(copiedCountdown.startDate);
        copiedCountdown.endDate = new Date(copiedCountdown.endDate);

        for (let milestone of copiedCountdown.milestones)
        {
            milestone.date = new Date(milestone.date);
        }

        copiedCountdown.milestones[this.appService.selected().milestone].notes = this.editNotes();
        copiedCountdown.milestones[this.appService.selected().milestone].name = this.editName();
        copiedCountdown.milestones[this.appService.selected().milestone].date = new Date(this.editDate());

        this.appService.updateCurrentCountdown(copiedCountdown);
        this.notificationsService.updateNotifiedPropertyAfterEdit();
        this.appService.saveCountdowns();

        this.showSaveButton.set(false);
    }

    // This method runs when the user types in the notes textarea and determines whether the save button or error text is shown
    validateNotes()
    {
        if(this.editNotes().length <= 2000)
        {
            this.errorTextNotes.set("");
            this.showSaveButton.set(true);
        }
        else
        {
            this.errorTextNotes.set("Notes must be 2000 characters or less");
        }
    }

    validateName()
    {
        if(this.editName().length <= 100)
        {
            this.errorTextName.set("");
            this.showSaveButton.set(true);
        }
        else
        {
            this.errorTextName.set("Name must be 100 characters or less");
        }
    }

    validateDate()
    {
        let milestoneDate = this.editDate().getTime();
        let startDate = this.appService.current().startDate.getTime();
        let endDate = this.appService.current().endDate.getTime();

        if(!(isNaN(this.editDate().getTime()))
        && (milestoneDate >= startDate)
        && (milestoneDate <= endDate))
        {
            this.errorTextDate.set("");
            this.showSaveButton.set(true);
        }
        else
        {
            this.errorTextDate.set("Date must be between the start and end dates inclusive");
        }
    }
}