import { Component, computed } from '@angular/core';
import { StatusBarService } from './status-bar.service';

@Component({
  selector: 'app-status-bar',
  imports: [],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent {

  constructor(private statusBarService: StatusBarService){}

  getStatusBarText = computed(() => {
    return this.statusBarService.getStatusBarText();
  });
}
