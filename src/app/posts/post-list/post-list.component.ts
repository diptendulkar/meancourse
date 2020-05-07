import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../post.model';
import {PostsService} from  '../posts.service';
import { PageEvent } from '@angular/material/paginator';

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
isLoading = false;
totalPosts = 10;
postPerPage= 2;
currentpage =1;
pageSizeOptions = [1,2,5,10];
private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(){
    this.isLoading=true;
  this.postsService.getPosts(this.postPerPage,1);
  this.postsSub = this.postsService.getPostListener()
    .subscribe((posts: Post[]) =>{
    this.posts = posts;
    this.isLoading=false;
  });

  }

  onDelete(postId : string){
    this.postsService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();  // to prevent memory leaks
  }

  onChangePage(pageData : PageEvent){
    console.log(pageData);
    this.currentpage = pageData.pageIndex +1; // its start with 0 so added +1
    this,this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage,this.currentpage);
  }
}
