import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { SuggestedService } from '../../../../core/auth/services/suggested.service';
import { ISuggest } from '../../../../core/models/isuggest.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-right-side-feed',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './right-side-feed.component.html',
  styleUrl: './right-side-feed.component.css',
})
export class RightSideFeedComponent implements OnInit{
  private readonly suggestedService = inject(SuggestedService)
  suggestData = signal<ISuggest[]>([]);
    showFriends = signal(false);
    searchInput = new FormControl('', { nonNullable: true });
searchTerm = signal('');
    ngOnInit(): void {
       this.getSuggestFriend();
    }
toggleFriends() {
  this.showFriends.update(v => !v);
}
 getSuggestFriend(){
  this.suggestedService.getSuggested().subscribe({
    next:(res)=>{
      this.suggestData.set(res.data.suggestions)
      console.log(this.suggestData());
      
    },
    error:(err)=>{
      console.log(err);
      
    }
  })
 }

 getFollow(suggestId:string){
  this.suggestedService.followSuggest(suggestId).subscribe({
    next:(res)=>{
      console.log(res);
      this.suggestData.update(list => list.filter(user => user._id !== suggestId));
    },
    error:(err)=>{
      console.log(err.error.message);
      
    }
  })
 }


filteredFriends = computed(() => {
  const term = this.searchTerm().trim().toLowerCase();
  if (!term) return this.suggestData();

  return this.suggestData().filter(user =>
    user.name.toLowerCase().includes(term) ||
    user.username.toLowerCase().includes(term)
  );
});

search() {
  this.searchTerm.set(this.searchInput.value);
}
}
