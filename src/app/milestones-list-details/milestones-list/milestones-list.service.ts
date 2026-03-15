import { computed, Injectable } from "@angular/core";
import { AppService } from "../../app.service";
import { SettingsService } from "../../edit-settings-about/settings/settings.service";

@Injectable({providedIn: 'root'})
export class MilestonesListService
{
    constructor(private appService: AppService, private settingsService: SettingsService){}

    getMilestoneBar(index: number)
    {
        return computed(() => {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let startDate = this.appService.current().startDate.getTime();
        let milestoneDate = this.appService.current().milestones[index].date.getTime();

        if(milestoneDate <= startDate)
        {
            return 100;
        }

        let percentage = ((currentDate - startDate) / (milestoneDate - startDate)) * 100;

        // Capping percentage at 100%
        if(percentage > 100)
        {
            return 100;
        }

        return percentage;
        });
    }

    getMilestoneDaysRemaining(index: number)
    {
        return computed(() => {
            let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
            let milestoneDate = this.appService.current().milestones[index].date.getTime();

            let daysUntilMilestone = (milestoneDate - currentDate)/86400000;

            if(daysUntilMilestone < 1)
            {
                return this.settingsService.phrases().completed;
            }

            return daysUntilMilestone == 1 ? daysUntilMilestone + " " + this.settingsService.phrases().day : daysUntilMilestone + " " + this.settingsService.phrases().days;
        });
    }
}