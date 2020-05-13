import { Injectable } from '@angular/core';
import {Subject, from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {AuthDataModel} from './auth-data.model';

@Injectable({providedIn: 'root'}) // to add the service/ Provider into app.module
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuthenticated()
  {
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthDataModel = {email: email, password: password};

    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe( response => {
      console.log(response);
      this.router.navigate(['/']);  // redirecting to message list page
    });
  }

  login(email: string, password: string){
    const authData: AuthDataModel = {email: email, password: password};

    this.http.post("http://localhost:3000/api/user/login", authData)
    .subscribe( (response: any) => {
      console.log( "new token :: " +response.token);
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
       this.tokenTimer =  setTimeout( () => {
          this.logout();
        }, expiresInDuration * 1000); // in miliseconds

        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);  // redirecting to message list page
      }

    });
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']); // redirecting to message list page


  }


}
