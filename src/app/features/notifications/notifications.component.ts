import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationsService } from '../../core/auth/services/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
// export class NotificationsComponent implements OnInit {
//   private readonly notificationsService = inject(NotificationsService);
//   private readonly router = inject(Router);

//   notifications = signal<any[]>([]);
//   activeTab = signal<'all' | 'unread'>('all');
//   unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

//   ngOnInit(): void {
//     this.loadNotifications();
//   }

//   setTab(tab: 'all' | 'unread') {
//     this.activeTab.set(tab);
//     this.loadNotifications();
//   }

//   loadNotifications() {
//     this.notificationsService.getNotifications(this.activeTab() === 'unread').subscribe({
//       next: (res) => this.notifications.set(res.data.notifications),
//       error: (err) => console.log(err.error?.message ?? err),
//     });
//   }

//   openNotification(n: any) {
//     if (!n.isRead) this.markAsRead(n);

//     if (n.type.includes('follow')) {
//       this.router.navigate(['/userProfile', n.actor._id]);
//     } else if (n.entityType === 'post' && !n.entity?.unavailable) {
//       this.router.navigate(['/post-details', n.entityId]);
//     }
//   }
// markAsRead(n: any) {
//   this.notificationsService.markAsRead(n._id).subscribe({
//     next: () => {
//       this.notifications.update(list =>
//         list.map(item => item._id === n._id ? { ...item, isRead: true } : item));

//       this.notificationsService.unreadCount.update(c => Math.max(0, c - 1));
//     },
//     error: (err) => console.log(err.error?.message ?? err),
//   });
// }

// markAllAsRead() {
//   this.notificationsService.markAllAsRead().subscribe({
//     next: () => {
//       this.notifications.update(list => list.map(item => ({ ...item, isRead: true })));

//       this.notificationsService.unreadCount.set(0);
//     },
//     error: (err) => console.log(err.error?.message ?? err),
//   });
// }

//   messageFor(type: string): string {
//     if (type.includes('like')) return 'liked your ' + (type.includes('comment') ? 'comment.' : 'post.');
//     if (type.includes('comment')) return 'commented on your post.';
//     if (type.includes('reply')) return 'replied to your comment.';
//     if (type.includes('share')) return 'shared your post.';
//     if (type.includes('follow')) return 'started following you.';
//     return 'sent you a notification.';
//   }

//   iconFor(type: string): string {
//     if (type.includes('like')) return 'fa-thumbs-up';
//     if (type.includes('comment') || type.includes('reply')) return 'fa-comment';
//     if (type.includes('share')) return 'fa-retweet';
//     if (type.includes('follow')) return 'fa-user-plus';
//     return 'fa-bell';
//   }
// }
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  private readonly router = inject(Router);

  allNotifications = signal<any[]>([]);
  activeTab = signal<'all' | 'unread'>('all');

  notifications = computed(() =>
    this.activeTab() === 'unread'
      ? this.allNotifications().filter(n => !n.isRead)
      : this.allNotifications());

  unreadCount = computed(() => this.allNotifications().filter(n => !n.isRead).length);

  ngOnInit(): void {
    this.loadNotifications();
  }

  setTab(tab: 'all' | 'unread') {
    this.activeTab.set(tab);
  }



loadNotifications() {
  this.notificationsService.getAllNotifications().subscribe({
    next: (list) => this.allNotifications.set(list),
    error: (err) => console.log(err.error?.message ?? err),
  });
}

  openNotification(n: any) {
    if (!n.isRead) this.markAsRead(n);

    if (n.type.includes('follow')) {
      this.router.navigate(['/userProfile', n.actor._id]);
      return;
    }

    if (n.entityType === 'post') {
      this.router.navigate(['/post-details', n.entityId]);
    }
  }

  markAsRead(n: any) {
    this.notificationsService.markAsRead(n._id).subscribe({
      next: () => {
        this.allNotifications.update(list =>
          list.map(item => item._id === n._id ? { ...item, isRead: true } : item));

        this.notificationsService.unreadCount.update(c => Math.max(0, c - 1));
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.allNotifications.update(list => list.map(item => ({ ...item, isRead: true })));

        this.notificationsService.unreadCount.set(0);
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  messageFor(type: string): string {
    if (type.includes('like')) return 'liked your ' + (type.includes('comment') ? 'comment.' : 'post.');
    if (type.includes('comment')) return 'commented on your post.';
    if (type.includes('reply')) return 'replied to your comment.';
    if (type.includes('share')) return 'shared your post.';
    if (type.includes('follow')) return 'started following you.';
    return 'sent you a notification.';
  }

  iconFor(type: string): string {
    if (type.includes('like')) return 'fa-thumbs-up';
    if (type.includes('comment') || type.includes('reply')) return 'fa-comment';
    if (type.includes('share')) return 'fa-retweet';
    if (type.includes('follow')) return 'fa-user-plus';
    return 'fa-bell';
  }
}