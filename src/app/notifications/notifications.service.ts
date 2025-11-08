import { AfterViewInit, effect, Injectable, signal } from "@angular/core";
import { AppService } from "../app.service";
import { AppNotification } from "./notifications.model";
import { Countdown } from "../app.model";
import { SettingsService } from "../edit-settings-about/settings/settings.service";
import { NotificationSetting } from "../edit-settings-about/settings/settings.model";

@Injectable({providedIn: 'root'})
export class NotificationsService
{
    notifications = signal<AppNotification[]>([]);
    newNotifications = signal<AppNotification[]>([]);
    showNewNotifications = signal<boolean>(true);

    constructor(private appService: AppService, private settingsService: SettingsService)
    {
        if(localStorage["notifications"] !== undefined)
        {
            try
            {
                let previousNotifications: AppNotification[] = JSON.parse(localStorage["notifications"]);

                for(let notification of previousNotifications)
                {
                    notification.timestamp = new Date(notification.timestamp);
                }

                this.notifications.set([...previousNotifications]);
            }
            catch(e)
            {
                console.log("notifications data invalid.");
                throw e;
            }
        }
        this.generateNotifications();
        this.deleteNotificationsOlderThanAWeek();

        // New notifications appear for 10 seconds on load then hide again
        setTimeout(() => {
            this.showNewNotifications.set(false);
        }, 10000);

        // Clearing the new notifications array once the list is hidden as this data is now redundant (and giving time for the hide transition to happen)
        setTimeout(() => {
            this.newNotifications.set([]);
            console.log("newNotifications = []");
        }, 11000);
    }

    private generateNotifications()
    {
        // Generates all notifications and updates the notified properties
        let newCountdownNotifications: AppNotification[] = this.generateCountdownNotifications();
        let newMilestoneNotifications: AppNotification[] = this.generateMilestoneNotifications();

        // Adding the new notifications according to the notification setting
        if(this.settingsService.settings().notifications == NotificationSetting.Both)
        {
            this.notifications.set([...this.notifications(), ...newCountdownNotifications, ...newMilestoneNotifications]);

            this.newNotifications.set([...newCountdownNotifications, ...newMilestoneNotifications]);
        }
        else if(this.settingsService.settings().notifications == NotificationSetting.Countdowns)
        {
            this.notifications.set([...this.notifications(), ...newCountdownNotifications]);

            this.newNotifications.set(newCountdownNotifications);
        }
        else if(this.settingsService.settings().notifications == NotificationSetting.Milestones)
        {
            this.notifications.set([...this.notifications(), ...newMilestoneNotifications]);

            this.newNotifications.set(newMilestoneNotifications);
        }
        else if(this.settingsService.settings().notifications == NotificationSetting.Off){ return; }

        this.saveNotifications();
    }

    private generateCountdownNotifications()
    {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let countdownsCopy: Countdown[] = [...this.appService.countdownsCopy()];
        let newCountdownNotifications: AppNotification[] = [];

        // Iterating over all countdowns to generate notifications
        let countdownIndex = 0;
        for(let countdown of countdownsCopy)
        {
            // A notification should be created for a countdown if one has not been created already and the endDate has been reached
            if(!countdown.notified && (countdown.endDate.getTime() <= currentDate))
            {
                // New notifications only created for other countdowns
                if(countdownIndex !== this.appService.selected().countdown)
                {
                    let countdownName = this.appService.countdowns()[countdownIndex].name;
                    countdownName = countdownName.length == 0 ? ('countdown ' + (countdownIndex+1)) : countdownName;

                    newCountdownNotifications.push({
                        timestamp: new Date(),
                        message: "Countdown '" + countdownName + "' has been reached.",
                        countdown: countdownIndex,
                        milestone: -1
                    });

                    // setting notified to true to indicate that a notification has been created for this countdown
                    countdown.notified = true;
                }
                // No notifications created for current countdown but notified set to true so that notifications arent created for countdowns already visible
                else
                {
                    // setting notified to true to indicate that the countdown has been reached while being the selected countdown, and therefore no notification needs to be created
                    countdown.notified = true;
                }

                // Updating countdowns array with countdowns where notified = true
                this.appService.updateCountdown(countdownIndex, countdown);
            }

            countdownIndex += 1;
        }

        this.appService.saveCountdowns();

        return newCountdownNotifications;
    }

    private generateMilestoneNotifications()
    {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let countdownsCopy: Countdown[] = [...this.appService.countdownsCopy()];
        let newMilestoneNotifications: AppNotification[] = [];

        // Iterating over all milestones to generate notifications
        let countdownIndex = 0;
        for(let countdown of countdownsCopy)
        {
            let milestoneIndex = 0;
            for(let milestone of countdown.milestones)
            {
                // A notification should be created for a milestone if one has not been created already and the date has been reached
                if(!milestone.notified && (milestone.date.getTime() <= currentDate))
                {
                    // New notifications only created for other countdowns
                    if(countdownIndex !== this.appService.selected().countdown)
                    {
                        let countdownName = this.appService.countdowns()[countdownIndex].name;
                        countdownName = countdownName.length == 0 ? ('countdown ' + (countdownIndex+1)) : countdownName;

                        let milestoneName = this.appService.countdowns()[countdownIndex].milestones[milestoneIndex].name;
                        milestoneName = milestoneName.length == 0 ? ('milestone ' + (milestoneIndex+1)) : milestoneName;

                        newMilestoneNotifications.push({
                            timestamp: new Date(),
                            message: "Milestone '" + milestoneName + "' has been reached in countdown '" + countdownName + "'.",
                            countdown: countdownIndex,
                            milestone: milestoneIndex
                        });

                        // setting notified to true to indicate that a notification has been created for this milestone
                        milestone.notified = true;
                    }
                    // No notifications created for current countdown but notified set to true so that notifications arent created for countdowns already visible
                    else
                    {
                        // setting notified to true to indicate that the milestone has been reached while being in the selected countdown (so no notification needs to be created)
                        milestone.notified = true;
                    }
                }
                milestoneIndex += 1;
            }

            // Updating countdowns array with countdowns where notified = true
            this.appService.updateCountdown(countdownIndex, countdown);

            countdownIndex += 1;
        }

        this.appService.saveCountdowns();

        return newMilestoneNotifications;
    }

    deleteNotification(index: number)
    {
        let newNotifications = this.notifications().filter((_, i) => i !== index);

        this.notifications.set(newNotifications);
        
        this.saveNotifications();
    }

    deleteNotificationsByCountdown(countdownId: number)
    {
        let newNotifications = this.notifications().filter((_, i) => _.countdown !== countdownId);

        this.notifications.set(newNotifications);

        this.saveNotifications();
    }

    deleteNotificationByCountdownMilestone(countdown: number, milestone: number)
    {
        let newNotifications = this.notifications().filter((_, i) => !(_.countdown == countdown && _.milestone == milestone));

        this.notifications.set(newNotifications);

        this.saveNotifications();
    }

    deleteNewNotification(index: number)
    {
        let newNewNotifications = this.newNotifications().filter((_, i) => i !== index);

        this.newNotifications.set(newNewNotifications);
    }

    clearAllNotifications()
    {
        this.notifications.set([]);

        this.saveNotifications();
    }

    openNotification(countdown: number, milestone: number)
    {
        this.appService.switchCountdown(countdown);
        this.appService.selectMilestone(milestone);

        this.deleteNotificationsByCountdown(countdown);
    }

    // This updates the notified property of the current countdown / milestones in that countdown after an edit has been made
    updateNotifiedPropertyAfterEdit()
    {
        let currentDate = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) ).getTime();
        let countdownCopy = this.appService.currentCountdownCopy();

        if(countdownCopy.endDate.getTime() <= currentDate)
        {
            countdownCopy.notified = true;
        }
        else
        {
            countdownCopy.notified = false;
        }

        for(let milestone of countdownCopy.milestones)
        {
            if(milestone.date.getTime() <= currentDate)
            {
                milestone.notified = true;
            }
            else
            {
                milestone.notified = false;
            }
        }

        this.appService.updateCurrentCountdown(countdownCopy);
        this.appService.saveCountdowns();
    }

    deleteNotificationsOlderThanAWeek()
    {
        let theDateAWeekAgo = new Date( Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-7) ).getTime();

        let newNotifications = this.notifications().filter((_, i) => _.timestamp.getTime() >= theDateAWeekAgo);

        this.notifications.set(newNotifications);

        this.saveNotifications();
    }

    private saveNotifications()
    {
        localStorage["notifications"] = JSON.stringify(this.notifications());
    }
}