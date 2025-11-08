import { computed, effect, Injectable, signal } from "@angular/core";
import { AppService } from "../../app.service";
import { Countdown } from "../../app.model";

@Injectable({providedIn: 'root'})
export class MilestoneNotesService
{
    // This property contains the current milestone notes being edited, and after validation is copied over to the app service countdowns array
    editNotes = signal<string>("");
    showSaveButton = signal<boolean>(false);
    showErrorText = signal<boolean>(false);

    constructor(private appService: AppService)
    {
        // Assigning a copy of the current milestone notes to the editNotes property whenever the selected milestone changes
        effect(() => {

            if(this.appService.selected().milestone != -1)
            {
                let selectedMilestone = this.appService.selected().milestone;
                let newNotes = this.appService.current().milestones[selectedMilestone].notes;

                this.editNotes.set(newNotes);

                this.showSaveButton.set(false);
                this.showErrorText.set(false);
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

    saveNotes()
    {
        if(this.editNotes().length <= 2000)
        {
            // Saving notes to countdowns array by creating a deep copy and then assigning the new notes value to it
            let copiedCountdown: Countdown = JSON.parse(JSON.stringify(this.appService.current()));

            copiedCountdown.startDate = new Date(copiedCountdown.startDate);
            copiedCountdown.endDate = new Date(copiedCountdown.endDate);

            for (let milestone of copiedCountdown.milestones)
            {
                milestone.date = new Date(milestone.date);
            }

            copiedCountdown.milestones[this.appService.selected().milestone].notes = this.editNotes();

            this.appService.updateCurrentCountdown(copiedCountdown);
            this.appService.saveCountdowns();

            this.showSaveButton.set(false);

            return true;
        }

        return false;
    }

    // This method runs when the user types in the notes textarea and determines whether the save button or error text is shown
    validateNotes()
    {
        if(this.editNotes().length <= 2000)
        {
            this.showSaveButton.set(true);
            this.showErrorText.set(false);

            return true;
        }
        else
        {
            this.showSaveButton.set(false);
            this.showErrorText.set(true);

            return false;
        }
    }
}