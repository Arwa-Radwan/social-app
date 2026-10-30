import { inject, Injectable, signal } from '@angular/core';
import { PostsService } from '../posts/posts.service';

@Injectable({ providedIn: 'root' })
export class LikesDialogService {
  private readonly postsService = inject(PostsService);

  isOpen = signal(false);
  loading = signal(false);
  users = signal<any[]>([]);

  open(postId: string) {
    this.isOpen.set(true);
    this.loading.set(true);
    this.users.set([]);

    this.postsService.getPostLikes(postId).subscribe({
      next: (res) => {
        console.log(res);
        const data = res.data;
        this.users.set(Array.isArray(data) ? data : (data?.likes ?? data?.users ?? []));
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.loading.set(false);
      },
    });
  }

  close() {
    this.isOpen.set(false);
  }
}
