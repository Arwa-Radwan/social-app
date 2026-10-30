import { Component, AfterViewInit, OnInit, WritableSignal, signal, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';
import { Iuser } from '../../../../core/models/iposts.interface';
import { NotificationsService } from '../../../../core/auth/services/notifications.service';
import { ProfileService } from '../../../../core/auth/services/profile.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  loggedUserData: WritableSignal<Iuser> = signal({} as Iuser)
  private readonly router = inject(Router)
  private readonly profileService = inject(ProfileService);
userPhoto = this.profileService.userPhoto;
private readonly notificationsService = inject(NotificationsService);
unreadCount = this.notificationsService.unreadCount;
 ngOnInit(): void {
    this.notificationsService.refreshUnreadCount();
     initFlowbite();
     this.saveUserData()
 }
   saveUserData():void{
    this.loggedUserData.set(JSON.parse(localStorage.getItem('socialUser')!))
    console.log(this.loggedUserData());
    
  }
    logout() {
    localStorage.removeItem('socialToken');
    localStorage.removeItem('socialUser');
    this.router.navigate(['/login']);
  }
}