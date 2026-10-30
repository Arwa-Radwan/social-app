import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../core/auth/services/profile.service';
import { IProfile } from '../../core/models/iprofile.interface';
import { BookMarksService } from '../../core/auth/services/book-marks.service';
import { SuggestedService } from '../../core/auth/services/suggested.service';
import { IPosts } from '../../core/models/iposts.interface';
import { PostActionsComponent } from '../feed/components/post-actions/post-actions.component';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, PostActionsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly ProfileService = inject(ProfileService);
  private readonly bookMarksService = inject(BookMarksService);
  private readonly suggestedService = inject(SuggestedService);

  profileData: WritableSignal<IProfile> = signal({} as IProfile);
  profileMarks = signal<IPosts[]>([]);
  myPosts = signal<IPosts[]>([]);

  activeTab = signal<'posts' | 'saved'>('posts');
  activePosts = computed(() =>
    this.activeTab() === 'posts' ? this.myPosts() : this.profileMarks());

  ngOnInit(): void {
    this.getProfile();
    this.getMarks();
  }

  getProfile() {
    this.ProfileService.getProfile().subscribe({
      next: (res) => {
        this.profileData.set(res.data.user);
        this.ProfileService.userPhoto.set(res.data.user.photo);
const saved = JSON.parse(localStorage.getItem('socialUser') ?? '{}');
localStorage.setItem('socialUser', JSON.stringify({ ...saved, photo: res.data.user.photo }));
        this.getMyPosts(res.data.user._id);
      },
      error: (err) => console.log(err),
    });
  }

  getMyPosts(userId: string) {
    this.suggestedService.getUserPosts(userId).subscribe({
      next: (res) => {
        const data = res.data;
        this.myPosts.set(Array.isArray(data) ? data : (data?.posts ?? []));
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  getMarks() {
    this.bookMarksService.getBookMarks().subscribe({
      next: (res) => this.profileMarks.set(res.data.bookmarks),
      error: (err) => console.log(err),
    });
  }

  setTab(tab: 'posts' | 'saved') {
    this.activeTab.set(tab);
  }
uploadingPhoto = signal(false);

onPhotoSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  console.log('selected file:', file);
  input.value = '';
  if (!file) return;

  this.uploadingPhoto.set(true);
  this.ProfileService.uploadPhoto(file).subscribe({
    next: (res) => {
      console.log(res);
      this.uploadingPhoto.set(false);
      this.getProfile();
    },
    error: (err) => {
      console.log(err.error?.message ?? err);
      this.uploadingPhoto.set(false);
    },
  });
}
uploadingCover = signal(false);

onCoverSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  this.uploadingCover.set(true);
  this.ProfileService.uploadCover(file).subscribe({
    next: (res) => {
      console.log(res);
      this.uploadingCover.set(false);
      this.getProfile();
    },
    error: (err) => {
      console.log(err.error?.message ?? err);
      this.uploadingCover.set(false);
    },
  });
}

}
