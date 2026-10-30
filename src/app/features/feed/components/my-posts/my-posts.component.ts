import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SuggestedService } from '../../../../core/auth/services/suggested.service';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { IPosts } from '../../../../core/models/iposts.interface';
import { PostActionsComponent } from '../post-actions/post-actions.component';
import { DatePipe } from '@angular/common';
// import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-my-posts',
  imports: [RouterLink, PostActionsComponent, DatePipe],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit {
  private readonly suggestedService = inject(SuggestedService);
  private readonly postsService = inject(PostsService);

  myPosts = signal<IPosts[]>([]);
  loading = signal(true);
  loggedUser = JSON.parse(localStorage.getItem('socialUser') ?? '{}');

ngOnInit(): void {
  console.log('raw:', localStorage.getItem('socialUser'));
  console.log('id:', this.loggedUser._id);
  this.getMyPosts();
}

  getMyPosts() {
    this.loading.set(true);
    this.suggestedService.getUserPosts(this.loggedUser._id).subscribe({
      next: (res) => {
        console.log(res);
        const data = res.data;
        this.myPosts.set(Array.isArray(data) ? data : (data?.posts ?? []));
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.loading.set(false);
      },
    });
  }

  deletePost(postId: string) {
    if (!confirm('Delete this post?')) return;

    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.myPosts.update(list => list.filter(p => p._id !== postId));
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }
}
