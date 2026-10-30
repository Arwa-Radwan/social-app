import { ConfirmService } from './../confirm.service';
import { Component, HostListener, inject } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  confirm = inject(ConfirmService);
  state = this.confirm.state;

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.state()) this.confirm.answer(false);
  }
}
