import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { LikesDialogService } from '../../../../core/auth/services/shared/likes-dialog.service';
import { IPosts } from '../../../../core/models/iposts.interface';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-post-actions',
  imports: [ReactiveFormsModule, RouterLink, CommentsComponent],
  templateUrl: './post-actions.component.html',
  styleUrl: './post-actions.component.css',
})
export class PostActionsComponent {
  private readonly postsService = inject(PostsService);
  private readonly likesDialog = inject(LikesDialogService);

  post = input.required<IPosts>();
  showDetailsLink = input(true);
  shared = output<void>();

  loggedUser = JSON.parse(localStorage.getItem('socialUser') ?? '{}');

  // بتتحدث لوحدها لو الـ post اتغير من الأب
  likes = linkedSignal<string[]>(() => this.post().likes ?? []);
  sharesCount = linkedSignal<number>(() => this.post().sharesCount ?? 0);
  isLiked = computed(() => this.likes().includes(this.loggedUser._id));

  showComments = signal(false);
  sharing = signal(false);
  shareBody = new FormControl('', { nonNullable: true });

  toggleLike() {
    const uid = this.loggedUser._id;
    const old = this.likes();
    this.likes.set(this.isLiked() ? old.filter(id => id !== uid) : [...old, uid]);

    this.postsService.likePost(this.post()._id).subscribe({
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.likes.set(old);
      },
    });
  }

  openLikes() {
    if (this.likes().length > 0) this.likesDialog.open(this.post()._id);
  }

  toggleComments() {
    this.showComments.update(v => !v);
  }

  startShare() {
    this.shareBody.setValue('');
    this.sharing.set(true);
  }

  confirmShare() {
    this.postsService.sharePost(this.post()._id, this.shareBody.value).subscribe({
      next: () => {
        this.sharing.set(false);
        this.sharesCount.update(c => c + 1);
        this.shared.emit();
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }
}
