import { computed, Injectable } from "@angular/core";
import { AppService } from "../app.service";
import { SettingsService } from "../edit-settings-about/settings/settings.service";

@Injectable({providedIn: 'root'})
export class StatusBarService
{
    constructor(private appService: AppService, private settingsService: SettingsService){}

    getStatusBarText = computed(() => {

        let statusBarMessage = "";

        // If no milestone is selected the default text is displayed
        if(this.appService.selected().milestone == -1)
        {
            let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
            let startDate = this.appService.current().startDate.getTime();
            let daysSinceStart = (currentDate - startDate)/86400000;
    
            statusBarMessage = daysSinceStart == 1 ? daysSinceStart + " " + this.settingsService.phrases().day : daysSinceStart + " " + this.settingsService.phrases().days;
            statusBarMessage += " " + this.settingsService.phrases().sinceStart;

            // A countdown to the next milestone will be displayed if there is one
            let nextMilestoneIndex = -1;
            let currentIndex = 0;
            for(let milestone of this.appService.current().milestones)
            {
                if(milestone.date.getTime() > currentDate)
                {
                    // Initialising nextMilestoneIndex to the first future milestone index in the array, and then the future milestone with the earliest date
                    if(nextMilestoneIndex == -1 || milestone.date.getTime() < this.appService.current().milestones[nextMilestoneIndex].date.getTime())
                    {
                        nextMilestoneIndex = currentIndex;
                    }
                }

                currentIndex += 1;
            }

            // If a future milestone was found then a countdown to that milestone is added to the message
            if(nextMilestoneIndex != -1)
            {
                let daysUntilNextMilestone = (this.appService.current().milestones[nextMilestoneIndex].date.getTime() - currentDate)/86400000;
                // Displaying the milestone name or "milestone x" placeholder if name is empty
                let nextMilestoneName = this.appService.current().milestones[nextMilestoneIndex].name.length == 0 ? "milestone " + (nextMilestoneIndex+1) : this.appService.current().milestones[nextMilestoneIndex].name;

                statusBarMessage += " - " + daysUntilNextMilestone
                                          + " " + (daysUntilNextMilestone == 1 ? this.settingsService.phrases().day : this.settingsService.phrases().days)
                                          + " " + this.settingsService.phrases().remainingUntil
                                          + " " + nextMilestoneName;
            }

            // If a milestone(s) has been reached then this is indicated in the status bar text
            let milestonesReachedTodayCount = 0;
            let milestoneReachedMessage = "";
            currentIndex = 0;
            for(let milestone of this.appService.current().milestones)
            {
                if(milestone.date.getTime() == currentDate)
                {
                    milestonesReachedTodayCount += 1;
                    let milestoneName = milestone.name.length == 0 ? "milestone " + (currentIndex+1) : milestone.name;
                    milestoneReachedMessage = " - " + milestoneName + " " + this.settingsService.phrases().completed;
                }

                currentIndex += 1;
            }

            // If one milestone has been reached today the name of that milestone is displayed, otherwise "x milestones completed today" is displayed
            if(milestonesReachedTodayCount == 1)
            {
                statusBarMessage += milestoneReachedMessage;
            }
            else if(milestonesReachedTodayCount > 1)
            {
                statusBarMessage += " - " + milestonesReachedTodayCount + " " + this.settingsService.phrases().milestonesCompletedToday;
            }
        }
        else // If a milestone is selected then a countdown to that milestone is displayed
        {
            let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
            let milestoneIndex = this.appService.selected().milestone;
            let selectedMilestone = this.appService.current().milestones[milestoneIndex];
            let selectedMilestoneName = selectedMilestone.name.length == 0 ? "milestone " + (milestoneIndex+1) : selectedMilestone.name;

            let daysUntilMilestone = (selectedMilestone.date.getTime() - currentDate)/86400000;

            if(daysUntilMilestone < 1)
            {
                statusBarMessage = selectedMilestoneName + " " + this.settingsService.phrases().completed;
            }
            else
            {
                statusBarMessage = daysUntilMilestone
                                + " " + (daysUntilMilestone == 1 ? this.settingsService.phrases().day : this.settingsService.phrases().days)
                                + " " + this.settingsService.phrases().remainingUntil
                                + " " + selectedMilestoneName;
            }
        }

        return statusBarMessage;
    });
}