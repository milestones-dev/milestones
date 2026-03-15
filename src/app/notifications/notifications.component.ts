import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AppService } from '../app.service';
import { NotificationsService } from './notifications.service';
import { SettingsService } from '../edit-settings-about/settings/settings.service';
import { Theme } from '../edit-settings-about/settings/settings.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent
{
  constructor(private appService: AppService, private settingsService: SettingsService, private notificationsService: NotificationsService) {}

  themeIsLight = computed(() => {
    return this.settingsService.settings().theme == Theme.Light;
  });
  
  themeIsDark = computed(() => {
    return this.settingsService.settings().theme == Theme.Dark;
  });

  openNotifications(isOpen = true)
  {
    let newShow = {...this.appService.show()};

    newShow.notificationsList = isOpen;
    this.notificationsService.showNewNotifications.set(false);

    this.appService.show.set(newShow);
  }

  showNotifications = computed(() => {
    return this.appService.show().notificationsList;
  });

  showNewNotifications = computed(() => {
    return this.notificationsService.showNewNotifications();
  });

  getNotifications = computed(() => {
    return this.notificationsService.notifications();
  });

  getNewNotifications = computed(() => {
    return this.notificationsService.newNotifications();
  });

  deleteNotification(index: number)
  {
    this.notificationsService.deleteNotification(index);
  }

  deleteNotificationByCountdownMilestone(countdown: number, milestone: number)
  {
    this.notificationsService.deleteNotificationByCountdownMilestone(countdown, milestone);
  }

  deleteNewNotification(index: number)
  {
    this.notificationsService.deleteNewNotification(index);
  }

  openNotification(countdown: number, milestone: number)
  {
    this.notificationsService.openNotification(countdown, milestone);
    this.openNotifications(false);
  }

  clearAllNotifications()
  {
    this.notificationsService.clearAllNotifications();
  }

  twoOrMoreNotifications = computed(() => {
    return this.notificationsService.notifications().length >= 2;
  });
}
