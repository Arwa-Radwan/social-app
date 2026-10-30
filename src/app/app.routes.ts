import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authAllowedGuard } from './core/auth/guards/auth-allowed-guard';
import { alreadyAuthGuard } from './core/auth/guards/already-auth-guard';
import { SettingsComponent } from './features/feed/components/settings/settings.component';
import { PostDetailsComponent } from './features/post-details/post-details.component';
import { ProfileUsersComponent } from './features/feed/components/profile-users/profile-users.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { MyPostsComponent } from './features/feed/components/my-posts/my-posts.component';
import { MySavedComponent } from './features/feed/components/my-saved/my-saved.component';
import { AboutUsComponent } from './features/about-us/about-us.component';

export const routes: Routes = [
    {path:"", redirectTo:"login", pathMatch:"full"},
    {path:"", component:AuthLayoutComponent, canActivate: [alreadyAuthGuard] ,children:[
        {path:'login', component:LoginComponent, title:"auth/Login"},
        {path:'register', component:RegisterComponent, title:"auth/Register"}
    ]},
    {path:"", component:MainLayoutComponent, canActivate: [authAllowedGuard] ,children:[
        {path:'feed', component:FeedComponent, title:"Home-page"},
        {path:'post-details/:id', component:PostDetailsComponent, title:"post-details"},
        {path:'settings', component:SettingsComponent, title:"Change-password"},
        {path:'profile', component:ProfileComponent, title:"My-Profile"},
        {path:'userProfile/:id', component:ProfileUsersComponent, title:"Profile-users"},
        {path:'notifications', component:NotificationsComponent, title:"Notifications"},
        {path:'myPosts', component:MyPostsComponent, title:"myPosts"},
        {path:'mySaved', component:MySavedComponent, title:"mySaved"},
        {path:'aboutUs', component:AboutUsComponent, title:"aboutUs"}




        

    ]},
    {path:"**", component:NotfoundComponent}
];
