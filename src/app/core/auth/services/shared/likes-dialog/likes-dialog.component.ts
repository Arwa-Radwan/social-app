import { LikesDialogService } from './../likes-dialog.service';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-likes-dialog',
  imports: [RouterLink],
  templateUrl: './likes-dialog.component.html',
  styleUrl: './likes-dialog.component.css',
})
export class LikesDialogComponent {
  dialog = inject(LikesDialogService);

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.dialog.isOpen()) this.dialog.close();
  }
}
