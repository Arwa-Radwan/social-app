import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { IPosts } from '../../../../core/models/iposts.interface';
import { PostActionsComponent } from '../post-actions/post-actions.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-saved',
  imports: [RouterLink, PostActionsComponent, DatePipe],
  templateUrl: './my-saved.component.html',
  styleUrl: './my-saved.component.css',
})

export class MySavedComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  savedPosts = signal<IPosts[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.getSaved();
  }

  getSaved() {
    this.loading.set(true);
    this.postsService.getBookmarks().subscribe({
      next: (res) => {
        console.log(res);
        const data = res.data;
        this.savedPosts.set(Array.isArray(data) ? data : (data?.bookmarks ?? data?.posts ?? []));
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.loading.set(false);
      },
    });
  }

  unsave(postId: string) {
    this.postsService.toggleBookmark(postId).subscribe({
      next: () => {
        this.savedPosts.update(list => list.filter(p => p._id !== postId));
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }
}
