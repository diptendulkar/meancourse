import { Injectable } from '@angular/core';
import {Subject, from} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {AuthDataModel} from './auth-data.model';
import {environment} from 'src/environments/environment';

@Injectable({providedIn: 'root'}) // to add the service/ Provider into app.module
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  private BACKEND_URL =  environment.apiUrl + "/user";

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }
  getUserId(){
    return this.userId;
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

    this.http.post(this.BACKEND_URL + "/signup", authData)
    .subscribe( response => {
      //console.log(response);
      this.router.navigate(['/login']);  // redirecting to login page
    }, error => {
      this.authStatusListener.next(false);
    }
    );
  }

  login(email: string, password: string){
    const authData: AuthDataModel = {email: email, password: password};

    this.http.post(this.BACKEND_URL + "/login", authData)
    .subscribe( (response: any) => {
      console.log( "new token :: " +response.token);
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);

        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate)
        this.saveAuthData(token,expirationDate,this.userId);

        this.router.navigate(['/']);  // redirecting to message list page
      }

    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){ // if date is in future in miliseconds
      this.setAuthTimer(expiresIn/1000); // convert to seconds
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number){

    console.log("Setting timer:  " + duration);
    this.tokenTimer =  setTimeout( () => {
      this.logout();
    }, duration * 1000); // in miliseconds
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']); // redirecting to message list page


  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem("token" , token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){

    const token = localStorage.getItem("token");
    const  expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if( !token || !expirationDate || !userId){
      return;
    }

    return {
      token: token,
      expirationDate : new Date(expirationDate),
      userId: userId

    }
  }


}
