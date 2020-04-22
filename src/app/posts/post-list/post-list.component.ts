import { Component } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls:['./post-list.component.css']

})
export class PostListComponent
{

  posts= [
    {title:'First Post', content: ' This is First post content'},
    {title:'Second Post', content: ' This is Second post content'},
    {title:'Third Post', content: ' This is Third post content'}
  ]

}
