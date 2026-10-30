import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../core/auth/services/posts/posts.service';
import { DatePipe, Location } from '@angular/common';
import { Idetails } from '../../core/models/idetails.interface';
import { initFlowbite } from 'flowbite';
import { PostActionsComponent } from '../feed/components/post-actions/post-actions.component';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, PostActionsComponent, DatePipe],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private readonly activatedRoute= inject(ActivatedRoute);
  private readonly postsService = inject(PostsService)
  private readonly router = inject(Router);

loggedUserData = signal<any>(JSON.parse(localStorage.getItem('userData') ?? '{}'));
  detailsPost: WritableSignal<Idetails> = signal({} as Idetails)
  private readonly location = inject(Location);

goBack() {
  this.location.back();
}

deletePost(postId: string): void {
  if (!confirm('Delete this post?')) return;
  this.postsService.deletePost(postId).subscribe({
    next: () => this.router.navigate(['/feed']),
    error: (err) => console.log(err.error),
  });
}

  postId = signal('')
    ngOnInit(): void {
         this.readDataFromUrl();
         
    }
    
    readDataFromUrl(){
      this.activatedRoute.paramMap.subscribe( (res)=>{
        this.postId.set(res.get("id")!)
        
        console.log(this.postId());
        
          this.getPostDetails();
          
      })
    }

    getPostDetails(){
      this.postsService.getSinglePost(this.postId()).subscribe({
        next:(res)=>{
          this.detailsPost.set(res.data.post)
          setTimeout(() => initFlowbite(), 0);
          console.log(this.detailsPost());
        },
        error:(err)=>{
          console.log(err.error);
            if (err.status === 404) {
    this.router.navigate(['/feed']);
  }
        }
      })
    }
}
