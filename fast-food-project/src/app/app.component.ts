import { Component } from '@angular/core';

@Component({
  selector: 'fp-root',
  styleUrls: ['./app.component.css'],
  standalone: false,
  template: `
  <nav class='navbar navbar-expand navbar-light bg-light' style="padding-left: 0.5rem;">
     <a class='navbar-brand'>{{pageTitle}}</a>
     <ul class='nav nav-pills'>
       <li><a class='nav-link' routerLink='/welcome'>Home</a></li>
       <li><a class='nav-link' routerLink='/products'>Product List</a></li>
     </ul>
   </nav>
   <div class='container'>
     <router-outlet></router-outlet>
   </div>
 `
})
export class AppComponent {
  pageTitle = 'fast-food-project';
}