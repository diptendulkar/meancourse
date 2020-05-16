import {Post} from './post.model';

import { Injectable } from '@angular/core';
import {Subject, from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'}) // to add the service/ Provider into app.module
export class PostsService{

  private posts: Post[] =[];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  private BACKEND_URL =  environment.apiUrl + "/posts/";

  constructor(private http: HttpClient, private  router: Router) {}

  // to fetch records from DB
  getPosts(postPerPage: number, currentPage: number){
    const queryParams = '?pagesize='+postPerPage+'&page='+currentPage;

   this.http.get<{message: string, posts: any, maxPosts: number }>(this.BACKEND_URL + queryParams)

   //Pipe map is used to map db '_id' column to model class 'id'
   .pipe(map(postData => {
      return { posts: postData.posts.map(post => {
        return{
          title : post.title,
          content : post.content,
          id : post._id ,// maping the table columns
          imagePath: post.imagePath,
          creator: post.creator

        };
      }),
      maxPosts : postData.maxPosts
    };
   }))
   .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts}); // send js Object
   });
  }

  getPostListener(){
    return this.postsUpdated.asObservable();
  }

//fetch post based on id  from server
  getPost(id : string){
    return this.http.get<{_id: string, title: string, content: string,imagePath: string, creator: string} >
    (this.BACKEND_URL + id);
  }

  // to add records into DB
  addPost(title: string, content: string, image: File){
   // const post: Post = {id: null,title: title, content:content, imagePath: null};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, post: Post}>(this.BACKEND_URL, postData)
    .subscribe((responsedata) => {
      this.router.navigate(["/"]);
    });

  }

updatePost(id: string, title : string, content: string, image: File | string){
 // const post: Post ={ id: id, title: title, content:content, imagePath: null};
 let postData: Post | FormData;
 if(typeof(image) === 'object'){
    postData = new FormData();
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image,title);
 }else{
    postData ={
    id: id,
    title: title,
    content: content,
    imagePath: image,
    creator: null
   };
 }
  this.http
      .put(this.BACKEND_URL + id, postData)
      .subscribe( response => {
        this.router.navigate(["/"]);
      });
}


  deletePost(postId: string){
    return this.http.delete(this.BACKEND_URL + postId);

  }

}
