import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { IPosts, Iuser } from '../../../../core/models/iposts.interface';
import { PostActionsComponent } from '../post-actions/post-actions.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-middle-feed',
  imports: [ReactiveFormsModule, RouterLink, PostActionsComponent, DatePipe],
  templateUrl: './middle-feed.component.html',
  styleUrl: './middle-feed.component.css',
})
export class MiddleFeedComponent implements OnInit {
  private readonly postsService = inject(PostsService);



  allPosts: WritableSignal<IPosts[]> = signal([]);
  loggedUserData: WritableSignal<Iuser> = signal({} as Iuser);
  imgToDisplay: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);
  selectedImg!: File;

  bodyInput = new FormControl('', { nonNullable: true });
  privacyInput = new FormControl('public', { nonNullable: true });

  ngOnInit(): void {
    this.getAllPosts();
    this.saveUserData();
  }

  getAllPosts() {
   
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.allPosts.set(res.data.posts);
        setTimeout(() => initFlowbite(), 0);
      

      },
      error: (err) => {
        console.log(err);
        

      }
      
    });
  }

  saveUserData(): void {
    this.loggedUserData.set(JSON.parse(localStorage.getItem('socialUser')!));
  }

  // ---------- create ----------
  selectImg(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImg = target.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImg);
      fileReader.onload = (ev: ProgressEvent<FileReader>) => {
        this.imgToDisplay.set(ev.target?.result);
      };
    }
  }

  resetImg() {
    this.imgToDisplay.set(null);
  }

  submitCreate(e: SubmitEvent) {
    e.preventDefault();

    const myForm = new FormData();
    if (this.selectedImg) myForm.append('image', this.selectedImg);
    if (this.bodyInput.value) myForm.append('body', this.bodyInput.value);
    if (this.privacyInput.value) myForm.append('privacy', this.privacyInput.value);

    this.postsService.createPosts(myForm).subscribe({
      next: () => {
        this.getAllPosts();
        this.bodyInput.reset('');
        this.privacyInput.reset('public');
        this.imgToDisplay.set(null);
      },
      error: (err) => console.log(err.error),
    });
  }

  // ---------- edit ----------
  editingPostId = signal<string | null>(null);
  editBody = new FormControl('', { nonNullable: true });
  editImg: File | null = null;

  startEdit(post: IPosts) {
    this.editingPostId.set(post._id);
    this.editBody.setValue(post.body ?? '');
    this.editImg = null;
  }

  cancelEdit() {
    this.editingPostId.set(null);
  }

  selectEditImg(e: Event) {
    const input = e.target as HTMLInputElement;
    this.editImg = input.files?.[0] ?? null;
  }

  saveEdit(postId: string) {
    const formData = new FormData();
    formData.append('body', this.editBody.value);
    if (this.editImg) formData.append('image', this.editImg);

    this.postsService.updatePost(postId, formData).subscribe({
      next: () => {
        this.editingPostId.set(null);
        this.getAllPosts();
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  // ---------- delete / bookmark ----------
  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: () => this.getAllPosts(),
      error: (err) => console.log(err.error),
    });
  }

  toggleBookmark(post: IPosts) {
    this.postsService.toggleBookmark(post._id).subscribe({
      next: () => {
        this.allPosts.update(list =>
          list.map(p => p._id === post._id ? { ...p, bookmarked: !p.bookmarked } : p));
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }
}