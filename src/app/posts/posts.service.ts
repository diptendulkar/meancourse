import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject, from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'}) // to add the service/ Provider into app.module
export class PostsService{

  private posts: Post[] =[];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private  router: Router) {}

  // to fetch records from DB
  getPosts(){

   this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')

   //Pipe map is used to map db '_id' column to model class 'id'
   .pipe(map((postData) => {
      return postData.posts.map(post => {
        return{
          title : post.title,
          content : post.content,
          id : post._id // maping the table columns
        };
      });
   }))
   .subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
   });
  }

  getPostListener(){
    return this.postsUpdated.asObservable();
  }

//fetch post based on id  from server
  getPost(id : string){
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  // to add records into DB
  addPost(title: string, content: string, image: File){
    const post: Post = {id: null,title: title, content:content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', postData)
    .subscribe((responsedata) => {
      console.log(responsedata.message);
      const post: Post = {id: responsedata.postId, title: title, content: content};

      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });

  }

updatePost(id: string, title : string, content: string){
  const post: Post ={ id: id, title: title, content:content};
  this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe( response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts [oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
}


  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      console.log("Deleted!!");
    });
  }

}
