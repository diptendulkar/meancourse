import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';



@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.componnet.css']
})
export class PostCreateComponent implements OnInit {

enteredTitle='';
enteredContent='';
post : Post;

private mode ='create';
private postId : string;


ngOnInit(){
  this.route.paramMap.subscribe( (paramMap : ParamMap) =>{
      if(paramMap.has('postId')){
        this. mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);
        console.log(this.post.title);
      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
  });
}
constructor(public postsService: PostsService, public route: ActivatedRoute) {}

onSavePost(form: NgForm){
  if(form.invalid)
  {
    return;
  }
  if(this.mode === 'create'){
     this.postsService.addPost(form.value.title,form.value.content);
  }
  else{
    this.postsService.updatePost(this.postId, form.value.title, form.value.content);
  }
  form.resetForm();


  }
}
