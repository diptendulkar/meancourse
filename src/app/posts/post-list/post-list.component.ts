import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../post.model';
import {PostsService} from  '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls:['./post-list.component.css']

})
export class PostListComponent implements OnInit
{

  // posts= [
  //   {title:'First Post', content: ' This is First post content'},
  //   {title:'Second Post', content: ' This is Second post content'},
  //   {title:'Third Post', content: ' This is Third post content'}
  // ]

posts : Post[]= [];
private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(){
  this.posts = this.postsService.getPosts();
  this.postsSub = this.postsService.getPostListener()
    .subscribe((posts: Post[]) =>{
    this.posts = posts;
  });

  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();  // to prevent memory leaks
  }
}
