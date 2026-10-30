import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from './core/auth/services/shared/confirm-dialog/confirm-dialog.component';
import { LikesDialogComponent } from './core/auth/services/shared/likes-dialog/likes-dialog.component';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogComponent, LikesDialogComponent, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('social-app');
  //  ngOnInit(): void {
  //   initFlowbite();
  // }
}
