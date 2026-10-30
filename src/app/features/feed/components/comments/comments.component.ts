import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ConfirmService } from '../../../../core/auth/services/shared/confirm.service';
import { CommentsService } from '../../../../core/auth/services/comments/comments.service';


@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService= inject(CommentsService);
  private readonly confirmService = inject(ConfirmService);

  postId = input.required<string>();

  postComment = signal<any[]>([]);
  loading = signal(true);
  sortBy = signal<'relevant' | 'newest'>('relevant');
  loggedUser = JSON.parse(localStorage.getItem('socialUser') ?? '{}');

  newComment = new FormControl('', { nonNullable: true });
  editingId = signal<string | null>(null);
  editContent = new FormControl('', { nonNullable: true });

  // replies
  replies = signal<Record<string, any[]>>({});
  openReplies = signal<string[]>([]);
  replyingTo = signal<string | null>(null);
  replyControl = new FormControl('', { nonNullable: true });
  loadingRepliesId = signal<string | null>(null);

  sortedComments = computed(() => {
    const list = [...this.postComment()];
    if (this.sortBy() === 'newest') {
      return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));
  });

  ngOnInit(): void {
    this.getComments();
  }

  // ---------- comments ----------
  getComments() {
    this.commentsService.getComments(this.postId()).subscribe({
      next: (res) => {
        const data = res.data;
        this.postComment.set(Array.isArray(data) ? data : (data?.comments ?? []));
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.loading.set(false);
      },
    });
  }

  addComment() {
    const content = this.newComment.value.trim();
    if (!content) return;

    this.commentsService.createComment(this.postId(), content).subscribe({
      next: () => {
        this.newComment.reset('');
        this.getComments();
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  startEdit(c: any) {
    this.editingId.set(c._id);
    this.editContent.setValue(c.content);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  saveEdit(c: any) {
    const content = this.editContent.value.trim();
    if (!content) return;

    this.commentsService.updateComment(this.postId(), c._id, content).subscribe({
      next: () => {
        this.patch(c._id, { content });
        this.editingId.set(null);
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  async deleteComment(c: any) {
    const ok = await this.confirmService.ask({
      title: 'Delete comment?',
      message: 'This comment will be permanently removed.',
      confirmText: 'Delete',
    });
    if (!ok) return;

    this.commentsService.deleteComment(this.postId(), c._id).subscribe({
      next: () => this.postComment.update(list => list.filter(item => item._id !== c._id)),
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  isLiked(c: any): boolean {
    return !!c.likes?.includes(this.loggedUser._id);
  }

  toggleLike(c: any) {
    const uid = this.loggedUser._id;
    const oldLikes: string[] = c.likes ?? [];
    const newLikes = this.isLiked(c) ? oldLikes.filter(id => id !== uid) : [...oldLikes, uid];

    this.patch(c._id, { likes: newLikes });
    this.commentsService.likeComment(this.postId(), c._id).subscribe({
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.patch(c._id, { likes: oldLikes });      // رجوع لو فشل
      },
    });
  }

  // ---------- replies ----------
  toggleReplies(c: any) {
    if (this.openReplies().includes(c._id)) {
      this.openReplies.update(l => l.filter(id => id !== c._id));
      return;
    }
    this.openReplies.update(l => [...l, c._id]);
    if (!this.replies()[c._id]) this.loadReplies(c);
  }

  loadReplies(c: any) {
    this.loadingRepliesId.set(c._id);
    this.commentsService.getReplies(this.postId(), c._id).subscribe({
      next: (res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : (data?.replies ?? data?.comments ?? []);
        this.replies.update(map => ({ ...map, [c._id]: list }));
        this.loadingRepliesId.set(null);
      },
      error: (err) => {
        console.log(err.error?.message ?? err);
        this.loadingRepliesId.set(null);
      },
    });
  }

  startReply(c: any) {
    this.replyingTo.set(c._id);
    this.replyControl.reset('');
    if (!this.openReplies().includes(c._id)) this.toggleReplies(c);
  }

  cancelReply() {
    this.replyingTo.set(null);
  }

  sendReply(c: any) {
    const content = this.replyControl.value.trim();
    if (!content) return;

    this.commentsService.createReply(this.postId(), c._id, content).subscribe({
      next: () => {
        this.replyControl.reset('');
        this.replyingTo.set(null);
        this.patch(c._id, { repliesCount: (c.repliesCount ?? 0) + 1 });
        this.loadReplies(c);
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  async deleteReply(parent: any, r: any) {
    const ok = await this.confirmService.ask({
      title: 'Delete reply?',
      message: 'This reply will be permanently removed.',
      confirmText: 'Delete',
    });
    if (!ok) return;

    this.commentsService.deleteComment(this.postId(), r._id).subscribe({
      next: () => {
        this.replies.update(map => ({
          ...map,
          [parent._id]: (map[parent._id] ?? []).filter(x => x._id !== r._id),
        }));
        this.patch(parent._id, { repliesCount: Math.max(0, (parent.repliesCount ?? 1) - 1) });
      },
      error: (err) => console.log(err.error?.message ?? err),
    });
  }

  // ---------- helpers ----------
  isMine(c: any): boolean {
    return c.commentCreator?._id === this.loggedUser._id;
  }

  setSort(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.sortBy.set(value === 'Newest' ? 'newest' : 'relevant');
  }

  private patch(id: string, changes: any) {
    this.postComment.update(list =>
      list.map(item => item._id === id ? { ...item, ...changes } : item));

    this.replies.update(map => {
      const next: Record<string, any[]> = {};
      for (const key of Object.keys(map)) {
        next[key] = map[key].map(item => item._id === id ? { ...item, ...changes } : item);
      }
      return next;
    });
  }
}