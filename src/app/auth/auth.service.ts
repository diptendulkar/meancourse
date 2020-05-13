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
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient){}

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
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      }

    });
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);

  }
}
