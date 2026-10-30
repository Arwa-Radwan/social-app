import { Component, signal } from '@angular/core';
import { LeftSideFeedComponent } from './components/left-side-feed/left-side-feed.component';
import { MiddleFeedComponent } from './components/middle-feed/middle-feed.component';
import { RightSideFeedComponent } from './components/right-side-feed/right-side-feed.component';

@Component({
  selector: 'app-feed',
  imports: [LeftSideFeedComponent, MiddleFeedComponent, RightSideFeedComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  showFriends = signal(false);

toggleFriends() {
  this.showFriends.update(v => !v);
}
}



