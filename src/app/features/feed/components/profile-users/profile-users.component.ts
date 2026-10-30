import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SuggestedService } from '../../../../core/auth/services/suggested.service';
import { IPosts } from '../../../../core/models/iposts.interface';
import { IUserProfile } from '../../../../core/models/iuser-profile.interface';
import { PostActionsComponent } from '../post-actions/post-actions.component';

@Component({
  selector: 'app-profile-users',
  imports: [RouterLink, PostActionsComponent, DatePipe],
  templateUrl: './profile-users.component.html',
  styleUrl: './profile-users.component.css',
})
export class ProfileUsersComponent implements OnInit {
  private readonly suggestedService = inject(SuggestedService);
  private readonly route = inject(ActivatedRoute);
private readonly location = inject(Location);
  profileUserData: WritableSignal<IUserProfile> = signal({} as IUserProfile);
  profileUserDataPosts = signal<IPosts[]>([]);
  isFollowing = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getUserProfile(id);
        this.getUserPosts(id);
      }
    });
  }


goBack() {
  this.location.back();
}
  getUserProfile(profileId: string) {
    this.suggestedService.getUserProfile(profileId).subscribe({
      next: (res) => {
        this.profileUserData.set(res.data.user);
        this.isFollowing.set(res.data.isFollowing);
      },
      error: (err) => console.log(err),
    });
  }

  getUserPosts(userId: string) {
    this.suggestedService.getUserPosts(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.profileUserDataPosts.set(res.data.posts); // اضبطي المسار حسب الرد
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }
  toggleFollow() {
  const id = this.profileUserData()._id;

  this.suggestedService.followUnFollow(id).subscribe({
    next: (res) => {
      console.log(res);
      this.isFollowing.update(v => !v);
      this.profileUserData.update(user => ({
        ...user,
        followersCount: user.followersCount + (this.isFollowing() ? 1 : -1),
      }));
    },
    error: (err) => console.log(err.error?.message ?? err),
  });
}
}
